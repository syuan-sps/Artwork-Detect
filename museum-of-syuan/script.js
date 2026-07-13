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
  const viewportCenter = window.scrollY + window.innerHeight * 0.5;
  const active = sections.reduce((nearest, section) => {
    const center = section.offsetTop + section.offsetHeight * 0.5;
    const distance = Math.abs(center - viewportCenter);
    return distance < nearest.distance ? { id: section.id, distance } : nearest;
  }, { id: sections[0]?.id, distance: Number.POSITIVE_INFINITY });

  if (active.id) setActiveRoom(active.id);
};

routeLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.slice(1);
    if (id) setActiveRoom(id);
  });
});

window.addEventListener("scroll", () => {
  updateScrollVariable();
  updateActiveRoom();
}, { passive: true });
window.addEventListener("resize", () => {
  updateScrollVariable();
  updateActiveRoom();
});
updateScrollVariable();
updateActiveRoom();
