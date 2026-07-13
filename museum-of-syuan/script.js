const root = document.documentElement;
const sections = [...document.querySelectorAll("[id][data-room]")];
const routeLinks = [...document.querySelectorAll(".route-rail a")];

const updateScrollVariable = () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll", progress.toFixed(4));
};

const setActiveRoom = (id) => {
  routeLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
  });
};

const updateActiveRoom = () => {
  const active = sections.reduce((largest, section) => {
    const rect = section.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    return visible > largest.visible ? { id: section.id, visible } : largest;
  }, { id: sections[0]?.id, visible: 0 });

  if (active.id) setActiveRoom(active.id);
};

let pendingFrame = false;

const scheduleUiUpdate = () => {
  if (pendingFrame) return;
  pendingFrame = true;
  requestAnimationFrame(() => {
    pendingFrame = false;
    updateScrollVariable();
    updateActiveRoom();
  });
};

routeLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.slice(1);
    if (id) setActiveRoom(id);
  });
});

window.addEventListener("scroll", scheduleUiUpdate, { passive: true });
window.addEventListener("resize", scheduleUiUpdate);
updateScrollVariable();
updateActiveRoom();
