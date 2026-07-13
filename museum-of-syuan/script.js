const root = document.documentElement;
const sections = [...document.querySelectorAll("[data-room]")];
const routeLinks = [...document.querySelectorAll(".route-rail a")];

const updateScrollVariable = () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll", progress.toFixed(4));
};

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    routeLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("is-active", isActive);
    });
  },
  { threshold: [0.35, 0.55, 0.75] }
);

sections.forEach((section) => {
  if (section.id) observer.observe(section);
});

window.addEventListener("scroll", updateScrollVariable, { passive: true });
window.addEventListener("resize", updateScrollVariable);
updateScrollVariable();
