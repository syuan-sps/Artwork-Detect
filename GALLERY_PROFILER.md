# Chelsea Gallery Profiler — Full Documentation

> Live curatorial intelligence for 234 New York art galleries. Scrape any gallery's current and past exhibitions on demand, then get an AI-generated analysis of their programming choices, curatorial identity, and strategic direction.

---

## Table of Contents

1. [What It Does](#what-it-does)
2. [Quick Start](#quick-start)
3. [Features](#features)
4. [Gallery Coverage](#gallery-coverage)
5. [Architecture](#architecture)
6. [API Reference](#api-reference)
7. [Scraping Details](#scraping-details)
8. [AI Synthesis](#ai-synthesis)
9. [Environment Variables](#environment-variables)
10. [Extending the App](#extending-the-app)

---

## What It Does

Type a gallery name → get back:

- **Exhibition Timeline** — every past, current, and upcoming show scraped live from the gallery's website, tagged by status (on view / upcoming / past)
- **Curatorial Profile** — AI analysis of the gallery's programming patterns, mediums, movements, and demographic choices
- **Temporal Analysis** — three plain-English paragraphs answering:
  - *Past:* What choices did they make over the last 1–3 years?
  - *Now:* What is on view today and what does it signal?
  - *Next:* What are they betting on going forward?
- **Strategic Read** — one sharp sentence synthesizing the gallery's overall positioning

Everything is stateless and live — no database, no cache. Every search hits the gallery's real website.

---

## Quick Start

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/) for AI synthesis (optional — scraping works without it)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm install
npm start          # runs on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm start          # runs on http://localhost:3000
```

The React app proxies `/api/*` requests to `localhost:3001` automatically.

---

## Features

### Search & Autocomplete
- 234 galleries indexed with real-time autocomplete dropdown
- Keyboard navigation (↑ ↓ arrows, Enter to select, Esc to close)
- Fuzzy matching — type "Zwirner", "gagos", "pace", "hauser" etc.
- Featured badge on the 5 flagship galleries with hand-tuned scrapers

### Exhibition Timeline Tab
- Shows all scraped exhibitions grouped by status:
  - 🟢 **On View Now** — currently open
  - 🔵 **Upcoming** — not yet open
  - ⚪ **Past** — closed
- Each entry shows: exhibition title, artist(s), date range, location
- Count badges: "3 on view · 36 past"

### Curatorial Profile Tab
- **Summary** — 2–4 sentence identity statement
- **Past / Now / Next** temporal blocks with color coding
- **Strategic Read** — single synthesis sentence in italic serif
- **Primary Mediums** — ranked tag list
- **Movements & Styles** — art historical categories
- **Recurring Themes** — conceptual threads
- **Programming Patterns** — solo vs group, duration, format
- **Artist Demographics** — emerging/established split, nationality, gender, generation
- **Notable Strengths** — 2–4 differentiating qualities

---

## Gallery Coverage

### Featured Galleries (custom scrapers)

| Gallery | URL |
|---------|-----|
| David Zwirner | davidzwirner.com |
| Paula Cooper Gallery | paulacoopergallery.com |
| Gagosian | gagosian.com |
| Hauser & Wirth | hauserwirth.com |
| Pace Gallery | pacegallery.com |

### Standard Galleries (universal scraper) — selected

303 Gallery · 52 Walker · ACA Galleries · Acquavella Galleries · Albertz Benda · Alexander Gray Associates · Almine Rech · Andrew Kreps Gallery · Anton Kern Gallery · Anat Ebgi · Asya Geisberg Gallery · Berry Campbell · Bortolami Gallery · Bridget Donahue · Bruce Silverstein Gallery · CANADA · Casey Kaplan Gallery · Cheim & Read · ClampArt · Clearing · Craig Starr Gallery · DC Moore Gallery · De Buck Gallery · Dinner Gallery · Elizabeth Dee · Fergus McCaffrey · FLAG Art Foundation · François Ghebaly · Fredericks & Freiser · Friedman Benda · Galerie Lelong & Co. · Gallery Henoch · Garth Greenan Gallery · Gladstone Gallery · Gordon Robichaux · Greene Naftali · Hales Gallery · Half Gallery · Hannah Traore Gallery · Harper's Gallery · Hollis Taggart · Jack Shainman Gallery · James Cohan Gallery · Karma · Kaufmann Repetto · Kravets Wehby Gallery · Kurimanzutto · Lehmann Maupin · Lisson Gallery · Loretta Howard Gallery · Luhring Augustine · Luxembourg & Dayan · Marian Goodman Gallery · Marianne Boesky Gallery · Matthew Marks Gallery · Miles McEnery Gallery · Mitchell-Innes & Nash · Mnuchin Gallery · Morgan Lehman Gallery · Nara Roesler Gallery · Nicola Vassell Gallery · Perrotin · Petzel Gallery · Rachel Uffner Gallery · Ricco/Maresca Gallery · Robert Mann Gallery · Ryan Lee Gallery · Salon 94 · Sean Kelly Gallery · Sikkema Jenkins & Co. · Simon Lee Gallery · Skarstedt Gallery · Skoto Gallery · Sprüth Magers · Susan Inglett Gallery · Talwar Gallery · Templon · Thaddaeus Ropac · The Hole · Tina Kim Gallery · Van Doren Waxter · Victoria Miro · White Columns · White Cube · Yancey Richardson Gallery · Yossi Milo Gallery · Zürcher Gallery · *and 100+ more*

---

## Architecture

```
User types gallery name
        │
        ▼
React frontend (localhost:3000)
  autocomplete from GET /api/galleries
        │
        ▼  POST /api/profile { query }
Express backend (localhost:3001)
        │
        ├─ findGallery()          galleries.js    → look up URL + scraper config
        │
        ├─ scrapeGallery()        scraper.js      → Puppeteer headless Chrome
        │    ├─ Gallery-specific scraper (5 featured galleries)
        │    └─ Universal scraper (all others)
        │
        ├─ classifyExhibitions()  temporal.js     → tag each show past/current/upcoming
        │
        └─ synthesizeProfile()    synthesizer.js  → Claude claude-sonnet-4-6
                │
                └─ returns { summary, pastTrends, currentHighlights,
                             upcomingChoices, strategicTakeaway,
                             mediums, themes, movements, artistProfile,
                             programmingPatterns, notableStrengths }
```

**No database.** Every request triggers a fresh scrape and AI synthesis.

---

## API Reference

### `GET /api/health`
Returns `{ status: "ok", timestamp }`.

### `GET /api/galleries`
Returns the full list of 234 indexed galleries.

```json
[
  { "name": "Gagosian", "url": "https://gagosian.com", "tier": "featured" },
  { "name": "Greene Naftali", "url": "https://www.greenenaftaligallery.com", "tier": "standard" },
  ...
]
```

### `POST /api/profile`
**Body:** `{ "query": "Gagosian" }`

**Response:**
```json
{
  "gallery": { "name": "Gagosian", "url": "https://gagosian.com" },
  "exhibitions": [
    {
      "title": "Between the Clock and the Bed",
      "artists": "Jasper Johns",
      "dates": "January 22–April 24, 2026",
      "location": "980 Madison Avenue, New York",
      "status": "current"
    }
  ],
  "profile": {
    "summary": "This gallery tends to show...",
    "pastTrends": "...",
    "currentHighlights": "...",
    "upcomingChoices": "...",
    "strategicTakeaway": "...",
    "mediums": ["painting", "sculpture", ...],
    "themes": [...],
    "movements": [...],
    "artistProfile": {
      "emergingVsEstablished": "...",
      "nationalityPatterns": "...",
      "genderNotes": "...",
      "generationalFocus": "..."
    },
    "programmingPatterns": "...",
    "notableStrengths": [...],
    "exhibitionCount": 13
  },
  "scrapedAt": "2026-04-08T02:00:00.000Z"
}
```

Exhibition `status` is one of: `"past"` · `"current"` · `"upcoming"` · `"unknown"`

---

## Scraping Details

### Featured Gallery Scrapers

Each of the 5 featured galleries has a hand-tuned scraper that understands the specific site structure:

| Gallery | Approach | Key challenge |
|---------|----------|---------------|
| **Gagosian** | Puppeteer, `type-mc-sm` class elements | Artist + title merged in one DOM node |
| **David Zwirner** | Puppeteer, `a[href*="/exhibitions/"]` | Status text (`Now Open:`) mixed with title |
| **Paula Cooper** | Puppeteer, 3-page crawl (current + 2 archive pages) | Address text mixed with title |
| **Pace Gallery** | Puppeteer, `a[href*="/exhibitions/"]` | Status badge (`On View`) before title |
| **Hauser & Wirth** | Puppeteer with bot-detection fallback | Vercel security checkpoint (HTTP 429) |

### Artist/Title Splitting

Many gallery sites concatenate the artist name and exhibition title in one DOM text node (e.g. `"Jasper JohnsBetween the Clock and the Bed"`). The app uses a slug-based splitting algorithm:

1. Map each character in the combined text to its normalized position
2. Enumerate all slug word-boundary positions (hyphen split points)
3. For each boundary, check if the text prefix normalized == slug prefix
4. Score each candidate split: +2 if title starts uppercase, +1 if artist ends at space
5. Pick highest-scoring split

This correctly handles: `Elizabeth Peyton` / `mountains in my heart`, `Jasper Johns` / `Between the Clock and the Bed`, `Roy Lichtenstein` / `Painting with Scattered Brushstrokes`, and 12+ other patterns.

### Universal Scraper

For all 229 standard galleries, the universal scraper tries two strategies:

1. **Link extraction** — `a[href*="exhibition"]` links to individual show pages
2. **Card container extraction** — `article`, `[class*="exhibition"]`, `[class*="card"]` elements containing both a date and text

It tries multiple paths: `/exhibitions`, `/gallery-exhibitions`, `/shows`, `/program`, `/exhibitions/past`.

### Date Parsing & Temporal Classification

The `temporal.js` module parses date strings into JavaScript `Date` objects and classifies each exhibition:

| Status | Condition |
|--------|-----------|
| `current` | start ≤ today ≤ end |
| `past` | end < today |
| `upcoming` | start > today |
| `unknown` | no parseable date |

Handled formats:
- `March 26–May 2, 2026`
- `Mar 12 – Apr 25, 2026`
- `October 19, 2025–April 18, 2026`
- `Through April 25, 2026`

---

## AI Synthesis

Scraped exhibitions are sent to **Claude claude-sonnet-4-6** with a structured prompt. Exhibitions are pre-grouped into past/current/upcoming before being sent so Claude can reason about temporal trends explicitly.

The prompt asks Claude to produce seven fields:

| Field | Description |
|-------|-------------|
| `summary` | 2–4 sentence curatorial identity statement |
| `pastTrends` | What patterns appear in the historical exhibitions? |
| `currentHighlights` | What is open right now and what does it signal? |
| `upcomingChoices` | What is the gallery betting on next? |
| `strategicTakeaway` | One-sentence synthesis of past + future |
| `mediums` / `themes` / `movements` | Tag lists |
| `artistProfile` | Demographics: career stage, nationality, gender, generation |
| `programmingPatterns` | Structural: solo vs group, duration, format |
| `notableStrengths` | 2–4 gallery-specific differentiators |

Without an `ANTHROPIC_API_KEY`, all profile fields return `"Add ANTHROPIC_API_KEY to enable analysis"` but exhibition scraping and temporal classification still work fully.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No | Enables AI synthesis via Claude. Without it, scraping still works. |
| `PORT` | No | Backend port. Default: `3001` |

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

---

## Extending the App

### Adding a New Gallery

Edit `backend/src/galleries.js` and add a new entry:

```js
'my gallery': {
  name: 'My Gallery',
  url: 'https://www.mygallery.com',
  exhibitionsPath: '/exhibitions',  // path to the exhibitions page
  tier: 'standard',
},
```

The universal scraper will handle it automatically. If the site is JS-rendered and needs a custom scraper, add a new function in `scraper.js` and wire it into `scrapeGallery()`.

### Writing a Custom Scraper

```js
async function scrapeMyGallery() {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.goto('https://www.mygallery.com/exhibitions', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    const raw = await page.evaluate(() => {
      // extract { href, text } items
    });
    for (const item of raw) {
      // parse dates, location, split artist/title
      exhibitions.push({ title, artists, dates, location });
    }
  } finally {
    await browser.close();
  }
  return exhibitions;
}
```

Return value: array of `{ title: string, artists: string, dates: string, location: string }`.

---

*Built with React, Express, Puppeteer, and Anthropic Claude.*
