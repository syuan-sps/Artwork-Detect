# Artwork Similarity Search — Project Context

> Copy this file into your next chat to transfer full project knowledge.

---

## What This Project Is

An **artwork similarity search system** that takes any artwork title or artist name as input and returns the most similar artworks based on style, theme, and historical significance.

**Available as:**
- iOS app (Expo React Native)
- Streamlit web app
- CLI (Rich terminal)
- FastAPI REST API

---

## Repository

- **Branch:** `cursor/artwork-similarity-search-5c3c`
- **Base branch:** `main`
- **Remote:** `https://github.com/syuan-sps/Artwork-Detect`
- **PR:** `https://github.com/syuan-sps/Artwork-Detect/pull/1` (draft)

---

## Directory Structure

```
/workspace/
├── artwork_similarity.py       # Core TF-IDF similarity engine
├── app.py                      # Streamlit web app (black/grey/white UI)
├── cli.py                      # Rich terminal CLI
├── start_backend.sh            # One-command backend launcher
├── requirements.txt            # Python deps (scikit-learn, fuzzywuzzy, streamlit, etc.)
├── README.md
├── CONTEXT.md                  # ← this file
│
├── data/
│   └── artworks.json           # 1,026 unique artworks (JSON array)
│
├── backend/
│   ├── main.py                 # FastAPI REST API
│   └── requirements.txt        # fastapi, uvicorn
│
├── ios_app/                    # Expo React Native iOS app
│   ├── App.tsx                 # Root: NavigationContainer + Stack + Tabs
│   ├── app.json                # Expo config (dark UI, bundle ID)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/index.ts      # All TypeScript interfaces
│       ├── theme/index.ts      # Colors, Typography, Spacing constants
│       ├── services/api.ts     # HTTP client (fetch wrapper → FastAPI)
│       ├── hooks/
│       │   ├── useSearch.ts    # Search state + abort controller
│       │   └── useFilterOptions.ts
│       ├── components/
│       │   ├── ArtworkCard.tsx  # Main card (query, result, with score bars)
│       │   ├── FilterChip.tsx
│       │   ├── TagPill.tsx
│       │   ├── ScoreBar.tsx
│       │   ├── EmptyState.tsx
│       │   └── Separator.tsx
│       └── screens/
│           ├── SearchScreen.tsx  # Main search + results
│           ├── BrowseScreen.tsx  # Paginated browse + period tabs
│           ├── DetailScreen.tsx  # Full artwork detail
│           └── FilterScreen.tsx  # Modal filter sheet
│
└── generate_*.py               # Dataset generation scripts (already run)
```

---

## How the Similarity Engine Works (`artwork_similarity.py`)

Three weighted TF-IDF dimensions combined into a composite score:

| Dimension | Weight | What it captures |
|-----------|--------|-----------------|
| Style | 50% | movement, style keywords, medium, color palette |
| Theme | 35% | subject, description, historical significance |
| Context | 15% | artist, era/period, museum, nationality |

**Query resolution:** exact title → fuzzy title match (threshold 55) → artist name partial match

**Filters supported:** `artist`, `movement`, `period`, `gender`, `nationality` (all partial string match except `period` which is exact)

### Key methods on `ArtworkSimilarityEngine`

```python
engine = ArtworkSimilarityEngine()

engine.find_similar(query, top_n=8, min_score=0.03, filters=None)
# → { query_artwork, results: [{artwork, overall_score, style_score, theme_score, context_score}], matched_title, match_score, error }

engine.get_movements()      # sorted list
engine.get_periods()        # sorted list
engine.get_genders()        # ['female', 'male', 'non-binary', 'unknown']
engine.get_nationalities()  # sorted list
engine.get_artists()        # sorted list
engine.list_artworks()      # all titles
engine.get_artwork_by_title(title)
```

---

## Dataset (`data/artworks.json`)

**1,026 unique artworks.** Each entry:

```json
{
  "id": 1,
  "title": "Starry Night",
  "artist": "Vincent van Gogh",
  "year": 1889,
  "medium": "Oil on canvas",
  "movement": "Post-Impressionism",
  "period": "Realism / Impressionism",
  "style": ["expressionistic", "swirling", "textured", "emotional", "turbulent"],
  "subject": ["landscape", "night sky", "village", "moon", "stars"],
  "color_palette": ["blue", "yellow", "white", "dark blue", "gold"],
  "museum": "Museum of Modern Art (MoMA), New York",
  "description": "...",
  "historical_significance": "...",
  "artist_gender": "male",
  "artist_nationality": "Dutch",
  "tags": ["iconic", "swirling", "emotional", ...]
}
```

**Coverage:**
- 115 nationalities
- 291 movements
- 10 periods: `Ancient / Medieval`, `Early Renaissance`, `High Renaissance / Mannerism`, `Baroque`, `Rococo / Neoclassicism`, `Romanticism`, `Realism / Impressionism`, `Modernism`, `Post-War / Contemporary`, `Contemporary`
- Gender breakdown: 802 male, 142 female, 77 unknown, 4 non-binary, 1 mixed

---

## FastAPI Backend (`backend/main.py`)

```
GET /health
GET /search?q=QUERY&top=8&min_score=0.03&artist=&movement=&period=&gender=&nationality=
GET /artworks?limit=40&offset=0&movement=&period=&gender=&nationality=
GET /artwork/:id
GET /filters
```

### Run

```bash
pip install fastapi "uvicorn[standard]"
./start_backend.sh                    # port 8000
# or
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## iOS App (`ios_app/`)

### Navigation structure

```
NavigationContainer (dark theme)
└── Stack.Navigator
    ├── MainTabs  (Bottom Tabs)
    │   ├── Search  → SearchScreen
    │   └── Browse  → BrowseScreen
    ├── Detail    → DetailScreen  (slide from right)
    └── Filter    → FilterScreen  (modal, slide from bottom)
```

### Design system (`src/theme/index.ts`)

Pure black / white / grey. No color accents.

```typescript
Colors.bg0    = '#080808'   // app background
Colors.bg1    = '#111111'   // card background
Colors.bg2    = '#181818'
Colors.bg3    = '#222222'
Colors.textPrimary   = '#e8e8e8'
Colors.textSecondary = '#888888'
Colors.textTertiary  = '#444444'
Typography.titleFamily = 'Georgia'
Typography.monoFamily  = 'Courier New'
```

### Run

```bash
cd ios_app
npm install
npx expo start     # QR → Expo Go on device, or press 'i' for iOS Simulator
```

**Backend URL config** (`src/services/api.ts`):
```typescript
export const API_BASE = 'http://localhost:8000';
// Physical device: use your LAN IP, e.g. 'http://192.168.1.42:8000'
```

### Build for App Store

```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

---

## Streamlit Web App (`app.py`)

```bash
streamlit run app.py    # http://localhost:8501
```

Sidebar filters: Artist · Movement · Period · Artist Gender · Nationality.
Result cards with score bars, tag pills, metadata.

---

## CLI (`cli.py`)

```bash
python3 cli.py search "Starry Night"
python3 cli.py search "Starry Night" --gender female --top 6
python3 cli.py search "Mona Lisa" --period "Baroque"
python3 cli.py search "Guernica" --nationality "French"
python3 cli.py list --movement "Impressionism"
python3 cli.py info "The Kiss"
```

---

## Python Dependencies (`requirements.txt`)

```
streamlit>=1.32.0
scikit-learn>=1.4.0
numpy>=1.26.0
pandas>=2.2.0
fuzzywuzzy>=0.18.0
python-Levenshtein>=0.25.0
Pillow>=10.2.0
requests>=2.31.0
rich>=13.7.0
click>=8.1.7
```

Install: `pip install -r requirements.txt`

---

## Known Issues / Potential Next Steps

1. **No artwork images** — the dataset has no image URLs. Adding an image API (e.g. Wikimedia Commons lookup by title) would make the iOS app visually richer.
2. **`FIND SIMILAR` button on DetailScreen** — currently navigates to MainTabs but doesn't pre-fill the search query. Could use a shared context/event emitter or React Navigation params to pre-populate the search input.
3. **Backend URL hardcoded** — should be configurable via an env variable or Expo Constants for staging/production.
4. **EAS / App Store setup** — needs a paid Apple Developer account ($99/year) and EAS account for cloud builds.
5. **Dataset expansion** — generation scripts (`generate_*.py`) can be extended with more entries. Each entry needs: title, artist, year, medium, movement, style[], subject[], color_palette[], museum, description, historical_significance, artist_gender, artist_nationality.
6. **Search history** — could be stored with AsyncStorage in the iOS app.
7. **Offline mode** — bundle the artworks.json directly into the iOS app and run similarity in-app (no backend needed) using a JS port of the TF-IDF logic.
