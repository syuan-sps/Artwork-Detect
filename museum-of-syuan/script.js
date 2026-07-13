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
      title: "A lens for markets and institutions.",
      body: "Columbia Economics & Art History candidate who uses a Taiwanese, bilingual comparative lens to read markets, institutions, and culture — then turns that reading into structured recommendations. 用台灣視角與雙語比較能力，把制度與市場細節整理成可討論、可驗證的判斷。",
      tags: ["Quant + qual", "Bilingual judgment", "Consulting-ready frame"],
    },
    {
      id: "ticketing",
      label: "Ticketing",
      still: "assets/stills/ticketing.png",
      clip: "assets/vid/ticketing.mp4",
      accent: "#d2a82d",
      scroll: 1.25,
      linger: 0.24,
      eyebrow: "02 · Ticketing / 票務口 · Methods",
      title: "Tools before the tour.",
      body: "BA Economics & Art History (Columbia, Dec 2026), CFA Level I candidate (Nov 2026), Bloomberg Market Concepts, and Mandarin / English / French / Korean — the methods stack behind clean data work and multilingual stakeholder communication. 方法先過關：財務與市場工具、文本與數據分析能力，以及跨語言溝通。",
      tags: ["CFA L1 · Nov 2026", "Bloomberg", "4 languages"],
    },
    {
      id: "galleries",
      label: "Galleries",
      still: "assets/stills/galleries.png",
      clip: "assets/vid/galleries.mp4",
      accent: "#343434",
      scroll: 1.55,
      linger: 0.36,
      eyebrow: "03 · Galleries / 展覽廳 · Evidence",
      title: "Decisions backed by proof.",
      body: "Senior thesis: dictionary text analysis on 1,130 Met vs AIC artworks (1950–2024). Classification work across 570K+ museum records. Global Thought fellowship synthesizing 60+ sources into a 40+ page argument. Leadership that ran: 13-person TSA team / 400+ members / $1K+ sponsorships per event; NGO outcome reporting for 65+ students; PTK tracking for 250–300 members. 證據在前：數字、取捨與結果，不只美學敘事。",
      tags: ["1,130 artworks", "570K+ records", "60+ sources · ops scale"],
    },
    {
      id: "gift-shop",
      label: "Gift Shop",
      still: "assets/stills/gift-shop.png",
      clip: "assets/vid/gift-shop.mp4",
      accent: "#8f8a80",
      scroll: 1.2,
      linger: 0.22,
      eyebrow: "04 · Gift Shop / 禮品店 · Transferables",
      title: "What a team can use Monday.",
      body: "Portable consulting muscles: data integrity & reconciliation, multi-stakeholder coordination, portfolio-style reporting, process standardization, and synthesis under ambiguity — Excel / R / LLM-assisted research, not just slide polish. 可帶走的能力：把混亂變成可比較的資料、可執行的流程、可對齊的利害關係人溝通。",
      tags: ["Reconciliation", "Stakeholder ops", "Synthesis under ambiguity"],
    },
    {
      id: "aerial",
      label: "Aerial",
      still: "assets/stills/aerial.png",
      clip: "assets/vid/aerial.mp4",
      accent: "#151515",
      scroll: 1.65,
      linger: 0.42,
      eyebrow: "05 · Aerial View / 空拍全館 · Synthesis",
      title: "Range with a clear through-line.",
      body: "One map, one thesis: Taiwanese comparative judgment + economic rigor + cultural literacy, proven in research, leadership systems, and clean reporting — built to start a consulting conversation, then win it in the case interview. 跨度清楚、核心不散：用證據說話，再把討論帶回結構化解題。",
      tags: ["Brand layer", "Case-ready next", "Contact for the brief"],
      cta: {
        primary: { label: "Email Syuan / 聯絡敘安", href: "mailto:sxxyuan@gmail.com" },
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
