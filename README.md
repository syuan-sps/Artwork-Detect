# Chelsea Gallery Profiler

Live curatorial intelligence for contemporary art galleries. Enter a gallery name to get a structured profile — exhibition history + AI-synthesized curatorial analysis — scraped fresh from the gallery's own website.

## 167 Galleries Indexed

### Featured (custom scrapers)
- David Zwirner · Paula Cooper Gallery · Gagosian · Hauser & Wirth · Pace Gallery

### Chelsea / NYC (universal scraper)
303 Gallery · 52 Walker · ACA Galleries · Acquavella Galleries · Albertz Benda · Alexander Gray Associates · Almine Rech · Ameringer | McEnery | Yohe · Anat Ebgi · Anders Wahlstedt Fine Art · Andrew Kreps Gallery · Anton Kern Gallery · Asya Geisberg Gallery · Berry Campbell · Bill Brady Gallery · Black Cube · Blum · Bortolami Gallery · Bowery Gallery · Bridget Donahue · Bruce Silverstein Gallery · Bryce Wolkowitz Gallery · Bureau · CANADA · Casey Kaplan Gallery · Cheim & Read · ClampArt · Clearing · Company Gallery · Craig Starr Gallery · DC Moore Gallery · DCKT Contemporary · David Castillo Gallery · De Buck Gallery · Denny Dimin Gallery · Edward Thorp Gallery · Elizabeth Dee · Envoy Enterprises · Essex Street · FLAG Art Foundation · Foxy Production · François Ghebaly · Franklin Parrasch Gallery · Fredericks & Freiser · Friedman Benda · Galerie Lelong & Co. · Gladstone Gallery · Gordon Robichaux · Greene Naftali · Hales Gallery · Half Gallery · Hannah Traore Gallery · Heather James Fine Art · Hionas Gallery · Hirschl & Adler Galleries · Hollis Taggart · Invisible-Exports · Jack Shainman Gallery · James Cohan Gallery · Josh Lilley Gallery · Karma · Kate Werble Gallery · Kathryn Markel Fine Arts · Kaufmann Repetto · Kavi Gupta Gallery · Lehmann Maupin · Lisa Cooley · Lisson Gallery · Lucky Dragon · Luhring Augustine · Luxembourg & Dayan · Marian Goodman Gallery · Marianne Boesky Gallery · Marlborough Gallery · Martos Gallery · Mary Boone Gallery · Matthew Marks Gallery · Michael Rosenfeld Gallery · Microscope Gallery · Mike Weiss Gallery · Mitchell-Innes & Nash · Mnuchin Gallery · Monya Rowe Gallery · Mother Gallery · Mulherin Gallery · Nancy Hoffman Gallery · Nara Roesler Gallery · Nicelle Beauchene Gallery · Nicola Vassell Gallery · Night Gallery · Nino Mier Gallery · Olympia · Ota Fine Arts · P·P·O·W · Participant Inc · Paul Kasmin Gallery · Perrotin · Peter Blum Gallery · Petzel Gallery · Pippy Houldsworth Gallery · Prince Street Gallery · Rachel Uffner Gallery · Ramiken · Recess Art · Reyes | Finn · Robischon Gallery · Ryan Lee Gallery · SLAG Gallery · Salon 94 · Sargent's Daughters · Sean Kelly Gallery · Sikkema Jenkins & Co. · Simon Lee Gallery · Sims Contemporary · Situations · Skoto Gallery · Sprüth Magers · Sundaram Tagore Gallery · Talwar Gallery · Tanya Bonakdar Gallery · Taymour Grahne Projects · Thaddaeus Ropac · The Hole · The Journal Gallery · Thierry Goldberg Gallery · Thomas Erben Gallery · Thomas Nickles Project · Tilton Gallery · Van Doren Waxter · Victoria Miro · Vito Schnabel Gallery · White Columns · White Cube · Yancey Richardson Gallery · Zeno X Gallery · Zürcher Gallery · and more

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React (TypeScript) |
| Backend | Node.js + Express |
| Scraping | Cheerio (static) + Puppeteer (JS-rendered fallback) |
| AI Synthesis | Anthropic Claude API |

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Add your Anthropic API key to .env
npm install
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The frontend proxies API requests to `http://localhost:3001`.

## Architecture

- **Stateless** — no database. Every search triggers a live scrape + AI synthesis.
- **Gallery-specific scrapers** for each of the 5 galleries, with a universal fallback.
- **Puppeteer fallback** — if Cheerio (static fetch) fails, automatically retries with headless Chrome.
- **Claude synthesis** — scraped exhibitions are fed to `claude-sonnet-4-5` which returns a structured JSON curatorial profile.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude synthesis |
| `PORT` | Backend port (default: 3001) |
