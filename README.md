# Chelsea Gallery Profiler

Live curatorial intelligence for contemporary art galleries. Enter a gallery name to get a structured profile — exhibition history + AI-synthesized curatorial analysis — scraped fresh from the gallery's own website.

## Supported Galleries

- David Zwirner (`davidzwirner.com`)
- Paula Cooper Gallery (`paulacoopergallery.com`)
- Gagosian (`gagosian.com`)
- Hauser & Wirth (`hauserwirth.com`)
- Pace Gallery (`pacegallery.com`)

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
