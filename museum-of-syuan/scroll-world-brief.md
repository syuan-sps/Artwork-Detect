# Museum of Syuan Scroll World Brief

This is the Scroll World intake and generation plan for the desktop-only portfolio museum.
The page is wired through `mountScrollWorld(...)`; current stills are SVG placeholders in
`script.js` until Higgsfield stills and camera clips are generated.

## Intake

- Subject: Syuan Yu Siao's bilingual portfolio, presented as a Taiwanese + Western museum.
- Brand: Museum of Syuan.
- Palette: white `#ffffff`, warm museum paper `#f7f6f1`, black `#151515`, gray stone
  `#d6d2c8`, dark gray `#343434`, warm yellow light `#d2a82d`.
- Tone: polished, cutesy miniature, consulting-ready, Taiwan-toned.
- Art direction: reference-style isometric collectible miniature museum with Western
  columns, black Taiwanese tiled roofs, stone courtyard, ticket kiosk, gift shop, lanterns,
  benches, trees, fountain, and restrained yellow lighting.
- Camera architecture: Scroll World architecture B, dive-in + aerial connector between
  miniature rooms.
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

## Dive clip prompt template

Use one per scene, with `--start-image` set to the matching scene still:

> Single continuous cinematic camera move, no cuts. Begin high and far, looking down at
> the whole [SCENE] from outside like a tiny refined toy museum model. The camera slowly
> glides forward and descends toward [FOCAL POINT], as if flying inside. As the camera
> pushes in, the roof and upper structure gently lift and open away to reveal the warm
> interior. Isometric collectible miniature museum, grayscale stone, black Taiwanese
> tiled roofs, warm yellow lantern light, polished Nintendo-cute toy model, professional
> museum quality, smooth graceful slow motion, subtle parallax. No text, no captions.

## Connector prompt template

Use `--start-image` from the actual last frame of the previous rendered dive and
`--end-image` from the actual first frame of the next rendered dive:

> Single continuous camera move, no cuts. The camera smoothly pulls up and back out of
> [SCENE i], rising into the sky, then glides forward across the connected miniature
> museum world and arrives above [SCENE i+1], beginning to descend toward it. One
> connected refined grayscale museum island with Taiwanese tiled roofs, stone courtyard,
> lanterns, trees, gift shop, ticket kiosk, and fountain. Seamless flowing aerial
> transition, smooth graceful slow motion. No text, no captions.

## Asset slots

After Higgsfield generation, update `script.js`:

- `sections[0].still` -> `assets/stills/entrance.webp`
- `sections[0].clip` -> `assets/vid/entrance.mp4`
- `sections[1].still` -> `assets/stills/ticketing.webp`
- `sections[1].clip` -> `assets/vid/ticketing.mp4`
- `sections[2].still` -> `assets/stills/galleries.webp`
- `sections[2].clip` -> `assets/vid/galleries.mp4`
- `sections[3].still` -> `assets/stills/gift-shop.webp`
- `sections[3].clip` -> `assets/vid/gift-shop.mp4`
- `sections[4].still` -> `assets/stills/aerial.webp`
- `sections[4].clip` -> `assets/vid/aerial.mp4`
- `connectors` -> four encoded connector clips in order.

## Environment note

`higgsfield` is not currently installed on this machine, so this commit wires the real
Scroll World engine and generation plan but cannot render final AI clips here yet.
