const ASSETS = {
  entrance: { still: "assets/stills/entrance.png", clip: "assets/vid/entrance.mp4" },
  ticketing: { still: "assets/stills/ticketing.png", clip: "assets/vid/ticketing.mp4" },
  galleries: { still: "assets/stills/galleries.png", clip: "assets/vid/galleries.mp4" },
  "gift-shop": { still: "assets/stills/gift-shop.png", clip: "assets/vid/gift-shop.mp4" },
  aerial: { still: "assets/stills/aerial.png", clip: "assets/vid/aerial.mp4" },
};

const COPY = {
  en: {
    htmlLang: "en",
    title: "Museum of Syuan",
    description:
      "Museum of Syuan — a Scroll World portfolio for Syuan Yu Siao: economics, art history, and consulting-ready evidence.",
    cta: "Contact",
    hint: "scroll to fly through",
    switchLabel: "Language",
    sections: [
      {
        id: "entrance",
        label: "Entrance",
        accent: "#151515",
        scroll: 1.55,
        linger: 0.32,
        eyebrow: "01 · Entrance Hall · Positioning",
        title: "A lens for markets and institutions.",
        body: "Columbia Economics & Art History candidate who uses a Taiwanese comparative lens to read markets, institutions, and culture — then turns that reading into structured recommendations.",
        tags: ["Quant + qual", "Comparative judgment", "Consulting-ready frame"],
      },
      {
        id: "ticketing",
        label: "Ticketing",
        accent: "#d2a82d",
        scroll: 1.25,
        linger: 0.24,
        eyebrow: "02 · Ticketing · Methods",
        title: "Tools before the tour.",
        body: "BA Economics & Art History (Columbia, Dec 2026), CFA Level I candidate (Nov 2026), Bloomberg Market Concepts, and Mandarin / English / French / Korean — the methods stack behind clean data work and multilingual stakeholder communication.",
        tags: ["CFA L1 · Nov 2026", "Bloomberg", "4 languages"],
      },
      {
        id: "galleries",
        label: "Galleries",
        accent: "#343434",
        scroll: 1.55,
        linger: 0.36,
        eyebrow: "03 · Galleries · Evidence",
        title: "Decisions backed by proof.",
        body: "Senior thesis: dictionary text analysis on 1,130 Met vs AIC artworks (1950–2024). Classification work across 570K+ museum records. Global Thought fellowship synthesizing 60+ sources into a 40+ page argument. Leadership that ran: 13-person TSA team / 400+ members / $1K+ sponsorships per event; NGO outcome reporting for 65+ students; PTK tracking for 250–300 members.",
        tags: ["1,130 artworks", "570K+ records", "60+ sources · ops scale"],
      },
      {
        id: "gift-shop",
        label: "Gift Shop",
        accent: "#8f8a80",
        scroll: 1.2,
        linger: 0.22,
        eyebrow: "04 · Gift Shop · Transferables",
        title: "What a team can use Monday.",
        body: "Portable consulting muscles: data integrity & reconciliation, multi-stakeholder coordination, portfolio-style reporting, process standardization, and synthesis under ambiguity — Excel / R / LLM-assisted research, not just slide polish.",
        tags: ["Reconciliation", "Stakeholder ops", "Synthesis under ambiguity"],
      },
      {
        id: "aerial",
        label: "Aerial",
        accent: "#151515",
        scroll: 1.65,
        linger: 0.42,
        eyebrow: "05 · Aerial View · Synthesis",
        title: "Range with a clear through-line.",
        body: "One map, one thesis: Taiwanese comparative judgment + economic rigor + cultural literacy, proven in research, leadership systems, and clean reporting — built to start a consulting conversation, then win it in the case interview.",
        tags: ["Brand layer", "Case-ready next", "Contact for the brief"],
        cta: {
          primary: { label: "Email Syuan", href: "mailto:sxxyuan@gmail.com" },
          secondary: { label: "LinkedIn", href: "https://www.linkedin.com/in/syuan-yu-siao" },
        },
      },
    ],
  },
  zh: {
    htmlLang: "zh-Hant",
    title: "Museum of Syuan",
    description:
      "Museum of Syuan — 敘安的作品集：經濟學、藝術史，以及可直接進入顧問對話的證據。",
    cta: "聯絡",
    hint: "向下捲動參觀",
    switchLabel: "語言",
    sections: [
      {
        id: "entrance",
        label: "入口",
        accent: "#151515",
        scroll: 1.55,
        linger: 0.32,
        eyebrow: "01 · 入口大廳 · 定位",
        title: "讀市場，也讀制度。",
        body: "哥倫比亞大學經濟學與藝術史雙主修。以台灣視角與比較方法，整理市場、制度與文化細節，再轉成可討論、可驗證的建議。",
        tags: ["量化＋質化", "比較判斷", "顧問式框架"],
      },
      {
        id: "ticketing",
        label: "票務",
        accent: "#d2a82d",
        scroll: 1.25,
        linger: 0.24,
        eyebrow: "02 · 票務口 · 方法",
        title: "先過方法關。",
        body: "哥倫比亞經濟學與藝術史（2026年12月）、CFA Level I 候選人（2026年11月）、Bloomberg Market Concepts，以及華語／英語／法語／韓語——支撐乾淨資料工作與跨語言利害關係人溝通的方法組合。",
        tags: ["CFA L1 · 2026.11", "Bloomberg", "四種語言"],
      },
      {
        id: "galleries",
        label: "展覽",
        accent: "#343434",
        scroll: 1.55,
        linger: 0.36,
        eyebrow: "03 · 展覽廳 · 證據",
        title: "用證據做決定。",
        body: "學士論文：針對大都會博物館與芝加哥藝術博物館 1,130 件作品（1950–2024）做詞典式文本分析。處理超過 57 萬筆博物館紀錄的分類。全球思維獎學金彙整 60+ 份資料寫成 40+ 頁論證。領導經驗：13 人團隊／400+ 成員／單場逾千美元贊助；非營利成果報告涵蓋 65+ 名學生；榮譽學會追蹤 250–300 名成員。",
        tags: ["1,130 件作品", "57萬+ 筆資料", "60+ 來源 · 營運規模"],
      },
      {
        id: "gift-shop",
        label: "禮品店",
        accent: "#8f8a80",
        scroll: 1.2,
        linger: 0.22,
        eyebrow: "04 · 禮品店 · 可帶走能力",
        title: "週一就能帶進團隊。",
        body: "可遷移的顧問能力：資料完整性與校準、多方利害關係人協調、作品集式彙報、流程標準化，以及在模糊中做綜整——Excel／R／LLM 輔助研究，而不只是簡報美感。",
        tags: ["資料校準", "利害關係人營運", "模糊中綜整"],
      },
      {
        id: "aerial",
        label: "空拍",
        accent: "#151515",
        scroll: 1.65,
        linger: 0.42,
        eyebrow: "05 · 空拍全館 · 綜整",
        title: "跨度清楚，核心不散。",
        body: "一張地圖、一條主線：台灣比較視角＋經濟嚴謹＋文化判讀，在研究、領導系統與清楚彙報中被驗證——用來開啟顧問對話，再在個案面試裡把結構化解題做完。",
        tags: ["品牌層", "下一步：個案", "來信談簡報"],
        cta: {
          primary: { label: "聯絡敘安", href: "mailto:sxxyuan@gmail.com" },
          secondary: { label: "LinkedIn", href: "https://www.linkedin.com/in/syuan-yu-siao" },
        },
      },
    ],
  },
};

function getLang() {
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (fromQuery === "zh" || fromQuery === "en") return fromQuery;
  const stored = window.localStorage.getItem("museum-of-syuan-lang");
  return stored === "zh" ? "zh" : "en";
}

function setLang(lang) {
  const next = lang === "zh" ? "zh" : "en";
  window.localStorage.setItem("museum-of-syuan-lang", next);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  window.history.replaceState({}, "", url);
  return next;
}

function buildConfig(lang) {
  const pack = COPY[lang];
  return {
    brand: { name: "Museum of Syuan", href: "#top" },
    cta: { label: pack.cta, href: "mailto:sxxyuan@gmail.com" },
    hint: pack.hint,
    nav: true,
    atmosphere: true,
    diveScroll: 1.35,
    connScroll: 0.7,
    crossfade: 0.16,
    sections: pack.sections.map((section) => ({
      ...section,
      still: ASSETS[section.id].still,
      clip: ASSETS[section.id].clip,
    })),
    connectors: [],
  };
}

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

function syncLangSwitcher(lang) {
  document.querySelectorAll(".lang-switch [data-lang]").forEach((button) => {
    const active = button.getAttribute("data-lang") === lang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.documentElement.lang = COPY[lang].htmlLang;
  document.documentElement.dataset.lang = lang;
  document.title = COPY[lang].title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", COPY[lang].description);
  const switcher = document.querySelector(".lang-switch");
  if (switcher) switcher.setAttribute("aria-label", COPY[lang].switchLabel);
}

function bindUiEvents() {
  window.addEventListener("scroll", stabilizeActiveCopy, { passive: true });
  window.addEventListener("resize", stabilizeActiveCopy);
  document.addEventListener("click", (event) => {
    if (event.target.closest(".sw-nav__item, .sw-route__dot")) stabilizeActiveCopy();
  });
}

function mountMuseum(lang) {
  const world = document.getElementById("world");
  const y = window.scrollY;
  world.replaceChildren();
  mountScrollWorld(world, buildConfig(lang));
  syncLangSwitcher(lang);
  stabilizeActiveCopy();
  window.scrollTo(0, y);
}

document.querySelectorAll(".lang-switch [data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    const lang = setLang(button.getAttribute("data-lang"));
    mountMuseum(lang);
  });
});

bindUiEvents();
mountMuseum(setLang(getLang()));
