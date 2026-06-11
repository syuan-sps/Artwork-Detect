# Chelsea Gallery Profiler

Frontend for browsing Chelsea, Manhattan gallery spaces. The UI is built around an **industrial elegance** aesthetic — dark charcoal streets, warm brick accents, and gallery-window cards.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Design system

### Mood

Urban, serious, authoritative — evoking a walk down **West 25th Street** in Chelsea’s gallery district.

### Palette

| Token | Value | Use |
|-------|-------|-----|
| `--bg-deep` | `#0a0a0a` | Page background |
| `--bg-elevated` | `#111111` | Card facades, elevated surfaces |
| `--charcoal` | `#161616` | Search field, subtle panels |
| `--accent` | `#8B3A2A` | Brick / terracotta highlights |
| `--window` | `#f5f5f3` | Gallery card content panes |
| `--text-primary` | `#e8e6e1` | Body text on dark |
| `--text-muted` | `#8a8780` | Secondary copy |

### Typography

- **Display:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — headings, search, labels
- **Body:** [Inter](https://fonts.google.com/specimen/Inter) — paragraphs and UI copy

Fonts are loaded in `index.html`.

### Layout

- **Hero:** Grid overlay, soft fog gradient, and subtle noise texture for a concrete/brick feel
- **Search:** Large, minimal bar with thin borders and brick-toned focus ring
- **Cards:** Dark outer frame (facade) with bright inner pane (gallery window)
- **Grid:** Responsive `auto-fill` card grid, max content width `72rem`

## Project structure

```
frontend/
├── index.html          # Fonts + root mount
├── src/
│   ├── App.tsx         # Hero, search, gallery directory
│   ├── App.css         # Chelsea design tokens & components
│   ├── main.tsx        # React entry
│   └── index.css       # Global resets
├── package.json
└── vite.config.ts
```

## Customization

Design tokens live at the top of `src/App.css` under `:root`. Adjust colors, spacing, or grid size there to tune the Chelsea look without touching component markup.
