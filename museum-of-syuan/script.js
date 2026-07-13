mountScrollWorld(document.getElementById("world"), {
  brand: { name: "Museum of Syuan", href: "#top" },
  cta: { label: "Contact", href: "mailto:sxxyuan@gmail.com" },
  hint: "scroll to fly through",
  nav: true,
  atmosphere: true,
  diveScroll: 1.35,
  connScroll: 0.7,
  crossfade: 0.16,
  sections: [
    {
      id: "entrance",
      label: "Entrance",
      still: "assets/stills/entrance.png",
      clip: "assets/vid/entrance.mp4",
      accent: "#151515",
      scroll: 1.55,
      linger: 0.32,
      eyebrow: "01 · Entrance Hall / 入口大廳",
      title: "Museum of Syuan",
      body: "A bilingual portfolio museum for Taiwanese perspective, economics, art history, and consulting-ready judgment. 以台灣視角進場，從經濟學、藝術史與顧問式判斷展開敘安的作品集。",
      tags: ["Taiwan / 台灣", "Columbia", "Markets + culture"],
    },
    {
      id: "ticketing",
      label: "Ticketing",
      still: "assets/stills/ticketing.png",
      clip: "assets/vid/ticketing.mp4",
      accent: "#d2a82d",
      scroll: 1.25,
      linger: 0.24,
      eyebrow: "02 · Ticketing / 票務口",
      title: "Credentials before entry.",
      body: "Economics and Art History at Columbia, CFA Level I candidacy, Bloomberg Market Concepts, and four working languages. 入館前先看見方法與紀律：資料能力、人文訓練與跨語言視角。",
      tags: ["CFA L1", "Bloomberg", "4 languages"],
    },
    {
      id: "galleries",
      label: "Galleries",
      still: "assets/stills/galleries.png",
      clip: "assets/vid/galleries.mp4",
      accent: "#343434",
      scroll: 1.55,
      linger: 0.36,
      eyebrow: "03 · Galleries / 展覽廳",
      title: "Evidence meets judgment.",
      body: "Research and experience share one gallery: museum text analysis, Taiwan sovereignty work, TSA leadership, nonprofit data, and operating systems. 用數據找線索，用人文判斷讀出脈絡。",
      tags: ["570K+ records", "60+ sources", "TSA + NGO data"],
    },
    {
      id: "gift-shop",
      label: "Gift Shop",
      still: "assets/stills/gift-shop.png",
      clip: "assets/vid/gift-shop.mp4",
      accent: "#8f8a80",
      scroll: 1.2,
      linger: 0.22,
      eyebrow: "04 · Gift Shop / 禮品店",
      title: "Takeaways for a team.",
      body: "The portable skills: synthesis, data integrity, stakeholder coordination, portfolio reporting, and process standardization. 把展覽帶走，也把能力帶進團隊。",
      tags: ["Excel + R", "Reconciliation", "Reporting"],
    },
    {
      id: "aerial",
      label: "Aerial",
      still: "assets/stills/aerial.png",
      clip: "assets/vid/aerial.mp4",
      accent: "#151515",
      scroll: 1.65,
      linger: 0.42,
      eyebrow: "05 · Aerial View / 空拍全館",
      title: "The whole museum.",
      body: "A portfolio built to show range without losing focus: Taiwan, economics, art history, research, leadership, and practical judgment. 從空中回看，所有展區連成一張清楚的地圖。",
      tags: ["Taiwan lens", "Quant + qual", "Creative rigor"],
      cta: {
        primary: { label: "Contact Syuan / 聯絡敘安", href: "mailto:sxxyuan@gmail.com" },
        secondary: { label: "LinkedIn", href: "https://www.linkedin.com/in/syuan-yu-siao" },
      },
    },
  ],
  connectors: [],
});

function stabilizeActiveCopy() {
  requestAnimationFrame(() => {
    const navItems = [...document.querySelectorAll(".sw-nav__item")];
    const copies = [...document.querySelectorAll(".sw-copy")];
    let activeIndex = navItems.findIndex((item) => item.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;

    copies.forEach((copy, index) => {
      const active = index === activeIndex;
      copy.style.opacity = active ? "1" : "0";
      copy.style.transform = window.matchMedia("(max-width: 860px)").matches ? "none" : "translateY(-50%)";
      copy.style.pointerEvents = active ? "auto" : "none";
    });
  });
}

window.addEventListener("scroll", stabilizeActiveCopy, { passive: true });
window.addEventListener("resize", stabilizeActiveCopy);
window.addEventListener("load", stabilizeActiveCopy);
document.addEventListener("click", (event) => {
  if (event.target.closest(".sw-nav__item, .sw-route__dot")) stabilizeActiveCopy();
});
stabilizeActiveCopy();
