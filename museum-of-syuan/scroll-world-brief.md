# Museum of Syuan Scroll World Brief

This is the no-Higgsfield Scroll World brief for the desktop-only portfolio museum.
The page is wired through `mountScrollWorld(...)`; stills are generated reference-style
assets, and clips are lightweight desktop scrub videos created from those stills with
`ffmpeg`. This keeps the Scroll World interaction without requiring Higgsfield access.

## Intake

- Subject: Syuan Yu Siao's bilingual portfolio, presented as a Taiwanese + Western museum.
- Brand: Museum of Syuan.
- Palette: white `#ffffff`, warm museum paper `#f7f6f1`, black `#151515`, gray stone
  `#d6d2c8`, dark gray `#343434`, warm yellow light `#d2a82d`.
- Tone: polished, cutesy miniature, consulting-ready, Taiwan-toned.
- Copy rule: each room leads with evidence and transferable skills, written for a
  holistic applicant profile across consulting, finance, product, and museum roles.
  Keep EN and 中文 as separate single-language views (`?lang=en` / `?lang=zh`);
  never mix both languages on the same page. Brand name stays `Museum of Syuan`
  in English in both views. No em dashes. No email or LinkedIn CTAs on the page.
- Art direction: reference-style isometric collectible miniature museum with Western
  columns, black Taiwanese tiled roofs, stone courtyard, ticket kiosk, gift shop, lanterns,
  benches, trees, fountain, and restrained yellow lighting.
- Camera architecture: generated still sequence with scroll-scrubbed preview clips and
  crossfades between rooms.
- Mobile: desktop only.

## Style preamble

Use this verbatim for every scene still:

> Isometric collectible miniature museum diorama floating on a plain warm white
> `#f7f6f1` background with a soft contact shadow. A refined grayscale palette of
> white stone, black Taiwanese tiled roofs, soft gray plaza stones, dark charcoal trim,
> and tiny warm yellow lantern lights. Blend a Western classical museum facade with
> Taiwanese roof curves, courtyard lanterns, bonsai-like trees, benches, a fountain,
> ticket kiosk, and gift shop. Nintendo-cute polished toy model, rounded details,
> professional museum quality, tilt-shift miniature lighting, centered composition,
> absolutely no text, no letters, no numbers, no logos.

## Scene still prompts

### 01 Entrance Hall

Subject: The main museum entrance hall as a small island: grand Western columns, black
Taiwanese tiled roof, open glowing doorway, stone stairs, lanterns, fountain in the
center courtyard, two small guardian statues, trees, and a welcoming path. This room
represents Taiwanese identity, Columbia training, and the first point of entry.

### 02 Ticketing

Subject: A ticketing courtyard in the same museum world: the main museum in the
background, a cute ticket kiosk with warm yellow window light, orderly queue rails,
small credential plaques represented as abstract cards, stone paving, lanterns, and
benches. This room represents Columbia Economics and Art History, CFA Level I candidacy,
Bloomberg Market Concepts, and multilingual range.

### 03 Galleries

Subject: The museum gallery wing opened like a toy model: blank abstract framed artworks,
research tables, museum labels shown only as shapes with no text, data-card props,
curatorial cabinets, a Taiwan map-like abstract shape, and leadership planning boards.
This room combines projects and experience: Met/AIC text analysis, Taiwan sovereignty
fellowship, TSA leadership, Operation Exodus data, PTK tracking, and LINE vocabulary bot.

### 04 Gift Shop

Subject: A cozy museum gift shop in the same grayscale miniature style: shelves of small
catalogues, postcards, abstract souvenirs, a warm yellow shop window, tidy checkout
counter, stone courtyard, plants, and benches. This room represents portable takeaways:
synthesis, data integrity, stakeholder coordination, portfolio reporting, and process
standardization.

### 05 Aerial Museum

Subject: A final aerial view of the entire Museum of Syuan island: entrance hall,
ticketing kiosk, galleries, gift shop, fountain, bridge, lanterns, trees, and all paths
connected in one clear portfolio map. This is the contact CTA and full-museum overview.

## Preview clip approach

Each room has:

- one generated PNG still in `assets/stills/`
- one 8-second desktop MP4 in `assets/vid/`, created from the still with a subtle zoom
  so the Scroll World engine can scrub video time
- no connector clips; room changes use the engine crossfade

The current clip generation command shape is:

```bash
ffmpeg -loop 1 -i assets/stills/<name>.png -t 8 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00055,1.045)':d=200:s=1920x1080:fps=25,format=yuv420p" \
  -an -c:v libx264 -preset medium -crf 20 \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart \
  assets/vid/<name>.mp4
```

## Asset slots

Current assets occupy these slots:

- `sections[0].still` -> `assets/stills/entrance.png`
- `sections[0].clip` -> `assets/vid/entrance.mp4`
- `sections[1].still` -> `assets/stills/ticketing.png`
- `sections[1].clip` -> `assets/vid/ticketing.mp4`
- `sections[2].still` -> `assets/stills/galleries.png`
- `sections[2].clip` -> `assets/vid/galleries.mp4`
- `sections[3].still` -> `assets/stills/gift-shop.png`
- `sections[3].clip` -> `assets/vid/gift-shop.mp4`
- `sections[4].still` -> `assets/stills/aerial.png`
- `sections[4].clip` -> `assets/vid/aerial.mp4`
- `connectors` -> intentionally empty for the no-Higgsfield build.

## Positioning map (cross-industry)

| Room | Recruiter read | Proof to keep visible |
|------|----------------|-----------------------|
| Entrance | Distinctive lens across sectors | Quant + qual; markets, institutions, culture |
| Ticketing | Methods readiness | CFA L1, Bloomberg, 4 languages, Columbia Econ + Art History |
| Galleries | Evidence rooms | 1,130 artworks; 570K+ records; 60+ sources; TSA / NGO / PTK scale |
| Gift Shop | Transferables for any team | Reconciliation, stakeholder ops, synthesis under ambiguity |
| Aerial | Holistic through-line | Range without losing focus; no contact CTAs on page |

## Next iteration ideas

- Regenerate any still whose room content should be more specific.
- Add more pronounced Ken Burns motion per room by adjusting the `zoompan` expression.
- Add handcrafted connector stills if you want transitional “map view” beats without
  external video generation.
- Integrate `museum-of-syuan/` into the actual portfolio source repo when available.
- Link each gallery tag to a one-page writeup (problem, approach, so what).
