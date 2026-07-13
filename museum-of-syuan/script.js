const palette = {
  bg: "#f7f6f1",
  paper: "#f0ede5",
  stone: "#d6d2c8",
  stoneDark: "#8f8a80",
  ink: "#151515",
  slate: "#343434",
  tree: "#5f6a60",
  treeDark: "#3d463e",
  yellow: "#d2a82d",
};

const sceneSubjects = {
  entrance: {
    fountain: true,
    highlight: "lanterns",
    plaques: ["TW", "NYC"],
  },
  ticketing: {
    kioskLeft: true,
    highlight: "ticket",
    plaques: ["CFA", "BMC"],
  },
  galleries: {
    galleryWalls: true,
    highlight: "frames",
    plaques: ["570K", "60+"],
  },
  gift: {
    kioskRight: true,
    highlight: "shop",
    plaques: ["Excel", "R"],
  },
  aerial: {
    fountain: true,
    kioskLeft: true,
    kioskRight: true,
    galleryWalls: true,
    highlight: "all",
    plaques: ["EMAIL", "LINK"],
  },
};

function svgData(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function museumStill(id) {
  const subject = sceneSubjects[id];
  const glow = subject.highlight === "all" ? 0.22 : 0.12;
  const plaques = subject.plaques.map((label, index) => {
    const x = 1030 + index * 78;
    return `
      <g transform="translate(${x} 610)">
        <rect x="0" y="0" width="58" height="68" rx="8" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="5"/>
        <rect x="12" y="15" width="34" height="22" rx="4" fill="${palette.yellow}" opacity=".36"/>
        <text x="29" y="53" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="800" fill="${palette.ink}">${label}</text>
      </g>`;
  }).join("");

  const galleries = subject.galleryWalls ? `
    <g transform="translate(360 405)">
      <rect x="0" y="0" width="118" height="88" rx="12" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6"/>
      <rect x="18" y="18" width="28" height="34" rx="3" fill="${palette.yellow}" opacity=".62"/>
      <rect x="58" y="18" width="38" height="34" rx="3" fill="#ffffff" stroke="${palette.stoneDark}" stroke-width="3"/>
      <path d="M18 68h78" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g transform="translate(1110 405)">
      <rect x="0" y="0" width="118" height="88" rx="12" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6"/>
      <rect x="18" y="18" width="34" height="34" rx="3" fill="#ffffff" stroke="${palette.stoneDark}" stroke-width="3"/>
      <rect x="66" y="18" width="28" height="34" rx="3" fill="${palette.yellow}" opacity=".62"/>
      <path d="M18 68h78" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    </g>` : "";

  const leftKiosk = subject.kioskLeft ? kiosk(235, 525, "tickets") : kiosk(235, 525, "quiet");
  const rightKiosk = subject.kioskRight ? kiosk(1205, 525, "shop") : kiosk(1205, 525, "quiet");
  const fountain = subject.fountain ? `
    <g transform="translate(728 585)">
      <ellipse cx="72" cy="42" rx="88" ry="40" fill="${palette.ink}" opacity=".9"/>
      <ellipse cx="72" cy="37" rx="70" ry="28" fill="${palette.stoneDark}"/>
      <ellipse cx="72" cy="31" rx="46" ry="18" fill="#f5f3ed"/>
      <path d="M55 31c7-36 27-36 34 0" fill="none" stroke="${palette.yellow}" stroke-width="9" stroke-linecap="round" opacity=".72"/>
      <circle cx="72" cy="31" r="15" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="5"/>
    </g>` : "";

  return svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Museum of Syuan ${id} scene">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="32" stdDeviation="26" flood-color="#151515" flood-opacity=".18"/>
    </filter>
    <pattern id="stone" width="78" height="62" patternUnits="userSpaceOnUse" patternTransform="skewX(-8)">
      <rect width="78" height="62" fill="${palette.stone}"/>
      <path d="M0 0h78M0 31h78M39 0v31M16 31v31M62 31v31" fill="none" stroke="${palette.stoneDark}" stroke-width="3" opacity=".48"/>
    </pattern>
    <pattern id="tiles" width="28" height="18" patternUnits="userSpaceOnUse">
      <rect width="28" height="18" fill="${palette.ink}"/>
      <path d="M0 3h28M0 12h28M14 0v18" stroke="#4a4a4a" stroke-width="2" opacity=".7"/>
    </pattern>
  </defs>
  <rect width="1600" height="900" fill="${palette.bg}"/>
  <circle cx="1120" cy="160" r="230" fill="${palette.yellow}" opacity="${glow}"/>

  <g filter="url(#shadow)" transform="translate(134 85)">
    <path d="M120 612 244 166 1235 92 1418 518 1166 708 326 724Z" fill="#3a3936"/>
    <path d="M150 580 270 150 1216 84 1380 500 1150 670 340 690Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="14" stroke-linejoin="round"/>
    <path d="M252 536 335 224 1128 165 1258 474 1078 596 394 610Z" fill="url(#stone)" stroke="${palette.ink}" stroke-width="7" opacity=".96"/>

    <g transform="translate(514 142)">
      <rect x="116" y="96" width="446" height="228" rx="18" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="10"/>
      <rect x="36" y="142" width="120" height="182" rx="16" fill="#d5d1c8" stroke="${palette.ink}" stroke-width="9"/>
      <rect x="522" y="142" width="120" height="182" rx="16" fill="#d5d1c8" stroke="${palette.ink}" stroke-width="9"/>
      <path d="M78 112 174 48h422l90 64Z" fill="url(#tiles)" stroke="${palette.ink}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M192 62c46-62 294-62 340 0 20 28 22 52 22 52H170s2-24 22-52Z" fill="url(#tiles)" stroke="${palette.ink}" stroke-width="10"/>
      <path d="M230 134 338 65l112 69Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="340" cy="112" r="19" fill="${palette.yellow}" stroke="${palette.ink}" stroke-width="6" opacity=".8"/>
      <rect x="170" y="184" width="34" height="116" rx="17" fill="#ffffff" stroke="${palette.ink}" stroke-width="8"/>
      <rect x="250" y="184" width="34" height="116" rx="17" fill="#ffffff" stroke="${palette.ink}" stroke-width="8"/>
      <rect x="396" y="184" width="34" height="116" rx="17" fill="#ffffff" stroke="${palette.ink}" stroke-width="8"/>
      <rect x="476" y="184" width="34" height="116" rx="17" fill="#ffffff" stroke="${palette.ink}" stroke-width="8"/>
      <path d="M304 324v-92c0-44 72-44 72 0v92Z" fill="${palette.ink}"/>
      <rect x="272" y="324" width="136" height="20" fill="${palette.stoneDark}" stroke="${palette.ink}" stroke-width="5"/>
      <rect x="250" y="344" width="180" height="20" fill="${palette.stone}" stroke="${palette.ink}" stroke-width="5"/>
    </g>

    ${leftKiosk}
    ${rightKiosk}
    ${fountain}
    ${galleries}
    ${plaques}

    ${tree(250, 220, 1.1)}
    ${tree(1220, 210, 1.15)}
    ${tree(315, 600, 0.82)}
    ${tree(1115, 615, 0.78)}
    ${garden(245, 645)}
    ${garden(1125, 650)}
    ${lantern(520, 508)}
    ${lantern(1074, 508)}
    ${lantern(415, 642)}
    ${lantern(1186, 632)}
    ${bench(480, 654)}
    ${bench(925, 654)}
    <path d="M310 724c42-86 150-92 190 0" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="9"/>
    <path d="M348 724c26-42 84-42 110 0" fill="${palette.ink}"/>
  </g>
</svg>`);
}

function kiosk(x, y, type) {
  const lit = type === "tickets" || type === "shop";
  return `
    <g transform="translate(${x} ${y})">
      <rect x="0" y="40" width="132" height="96" rx="16" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="8"/>
      <path d="M-14 42 36 0h72l40 42Z" fill="url(#tiles)" stroke="${palette.ink}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="35" y="76" width="62" height="38" rx="7" fill="${lit ? palette.yellow : "#ffffff"}" opacity="${lit ? ".56" : ".7"}" stroke="${palette.ink}" stroke-width="5"/>
      <circle cx="28" cy="64" r="10" fill="${palette.yellow}" opacity="${lit ? ".8" : ".35"}"/>
      <circle cx="106" cy="64" r="10" fill="${palette.yellow}" opacity="${lit ? ".8" : ".35"}"/>
    </g>`;
}

function tree(x, y, scale) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <rect x="38" y="94" width="22" height="52" rx="8" fill="#5d4f43"/>
      <circle cx="49" cy="56" r="45" fill="${palette.treeDark}" stroke="${palette.ink}" stroke-width="7"/>
      <circle cx="27" cy="84" r="36" fill="${palette.tree}" stroke="${palette.ink}" stroke-width="6"/>
      <circle cx="73" cy="86" r="38" fill="${palette.tree}" stroke="${palette.ink}" stroke-width="6"/>
    </g>`;
}

function lantern(x, y) {
  return `
    <g transform="translate(${x} ${y})">
      <path d="M20 18v74" stroke="${palette.ink}" stroke-width="8" stroke-linecap="round"/>
      <rect x="4" y="0" width="32" height="34" rx="10" fill="${palette.yellow}" stroke="${palette.ink}" stroke-width="6"/>
    </g>`;
}

function bench(x, y) {
  return `
    <g transform="translate(${x} ${y})">
      <path d="M0 42h110" stroke="${palette.ink}" stroke-width="13" stroke-linecap="round"/>
      <path d="M12 18h86" stroke="${palette.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M24 42v36M86 42v36" stroke="${palette.ink}" stroke-width="8" stroke-linecap="round"/>
    </g>`;
}

function garden(x, y) {
  return `
    <g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="150" height="62" rx="14" fill="#d9d7ce" stroke="${palette.ink}" stroke-width="7"/>
      <circle cx="35" cy="28" r="15" fill="#ffffff" stroke="${palette.tree}" stroke-width="5"/>
      <circle cx="72" cy="34" r="14" fill="${palette.paper}" stroke="${palette.tree}" stroke-width="5"/>
      <circle cx="112" cy="25" r="15" fill="#ffffff" stroke="${palette.tree}" stroke-width="5"/>
    </g>`;
}

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
      still: museumStill("entrance"),
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
      still: museumStill("ticketing"),
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
      still: museumStill("galleries"),
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
      still: museumStill("gift"),
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
      still: museumStill("aerial"),
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
