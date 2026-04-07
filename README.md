# Artwork Similarity Search

> Available as a **web app** (Streamlit), **CLI** (Rich terminal), **REST API** (FastAPI), and **iOS app** (Expo React Native).



Find artworks similar to any given piece in terms of **visual style**, **thematic content**, and **historical significance** — with filters by artist, period, movement, gender, and nationality.

## How It Works

The engine computes similarity across three weighted dimensions:

| Dimension | Weight | What it captures |
|-----------|--------|-----------------|
| **Style** | 50 % | Art movement, style keywords, medium, color palette |
| **Theme** | 35 % | Subject matter, description, historical significance |
| **Context** | 15 % | Artist, era/period, museum, nationality |

Each dimension uses a **TF-IDF vectorizer** with **cosine similarity**. The three scores are combined into a single weighted composite. **Fuzzy matching** (token sort ratio) handles misspellings and partial titles automatically.

### Dataset: 1,026 curated artworks

- **115 nationalities** — European, East Asian, South Asian, African, Mesoamerican, Indigenous Australian, Pacific, Middle Eastern, Latin American, North American, and more
- **291 art movements** — Prehistoric cave painting through NFT digital art
- **10 historical periods** — Ancient/Medieval through Contemporary
- **Artist genders** tracked — male, female, non-binary, unknown
- Every entry has: `movement`, `style`, `subject`, `color_palette`, `description`, `historical_significance`, `artist_gender`, `artist_nationality`, `period`, `tags`

---

## iOS App

### Architecture

```
┌─────────────────────┐        HTTP/JSON        ┌────────────────────────┐
│  Expo React Native  │ ◄──────────────────────► │  FastAPI backend       │
│  ios_app/           │                          │  backend/main.py       │
│                     │  GET /search?q=...        │                        │
│  · SearchScreen     │  GET /filters             │  artwork_similarity.py │
│  · BrowseScreen     │  GET /artworks            │  data/artworks.json    │
│  · DetailScreen     │  GET /artwork/:id         │  1,026 artworks        │
│  · FilterScreen     │                          │                        │
└─────────────────────┘                          └────────────────────────┘
```

### Run the backend

```bash
pip install fastapi "uvicorn[standard]"
./start_backend.sh           # listens on :8000
# or: uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Run the iOS app

```bash
cd ios_app
npm install
npx expo start          # scan QR with Expo Go on your iPhone
# or press 'i' for iOS Simulator (requires macOS + Xcode)
```

**Configure the backend URL** in `ios_app/src/services/api.ts`:
```typescript
export const API_BASE = 'http://YOUR_LAN_IP:8000';
// iOS Simulator: use 'http://localhost:8000'
// Physical device: use your machine's LAN IP, e.g. 'http://192.168.1.42:8000'
```

### iOS App Screens

| Screen | Description |
|--------|-------------|
| **Search** | Type any artwork title or artist. Fuzzy matching, quick-pick presets, active filter chips. Results show similarity scores broken into Style / Theme / Context bars. |
| **Browse** | Paginated list of all 1,026 works. Filter by period using tab strip. Infinite scroll. |
| **Detail** | Full artwork metadata: description, historical significance, all fields, tag pills. |
| **Filter** | Modal sheet to set Artist Gender, Period, Movement, Nationality. Applied filters shown as removable chips on Search screen. |

### Build for the App Store

```bash
cd ios_app
npx expo install expo-build-properties
eas build --platform ios       # requires EAS CLI and Apple Developer account
```

---

## Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Launch the web application

```bash
streamlit run app.py
```

Then open [http://localhost:8501](http://localhost:8501).

**Web UI features:**
- Minimalist black/grey/white editorial design
- Sidebar filters: Artist · Movement · Period · Artist Gender · Nationality
- Per-dimension score bars (Style / Theme / Context)
- Tag pills and full metadata on each result
- Quick-search preset buttons

### 3. Use the command-line interface

```bash
# Basic search
python3 cli.py search "Starry Night"

# With filters
python3 cli.py search "Starry Night" --gender female
python3 cli.py search "Mona Lisa" --period "Baroque" --top 6
python3 cli.py search "Guernica" --nationality "French" --movement "Impressionism"
python3 cli.py search "The Scream" --artist "Monet" --top 4

# Other options
python3 cli.py search "Water Lilies" --top 8 --min-score 3 --verbose

# Browse the database
python3 cli.py list
python3 cli.py list --movement "Impressionism"
python3 cli.py info "The Kiss"
```

**Available filters (CLI):**

| Flag | Description |
|------|-------------|
| `--artist NAME` | Partial artist name match |
| `--movement M` | Partial movement keyword |
| `--period P` | Exact period string (e.g. `"Baroque"`) |
| `--gender G` | `male` / `female` / `unknown` / `non-binary` |
| `--nationality N` | Partial nationality match (e.g. `"Japanese"`) |

### 4. Use as a Python library

```python
from artwork_similarity import ArtworkSimilarityEngine

engine = ArtworkSimilarityEngine()

# Basic search
result = engine.find_similar("Starry Night", top_n=5)

# With filters
result = engine.find_similar(
    "Guernica",
    top_n=8,
    filters={"gender": "female", "period": "Modernism"},
)

for res in result["results"]:
    a = res["artwork"]
    print(f'{a["title"]} by {a["artist"]} ({a["year"]}) — {res["overall_score"]*100:.0f}% similar')

# Get filter options
print(engine.get_periods())
print(engine.get_movements())
print(engine.get_nationalities())
print(engine.get_genders())
```

---

## Project Structure

```
artwork-similarity-search/
├── artwork_similarity.py       # Core TF-IDF similarity engine with filters
├── app.py                      # Streamlit web application (B&W minimal UI)
├── cli.py                      # Rich terminal CLI with filter flags
├── data/
│   └── artworks.json           # 1,026-artwork dataset
├── generate_artworks.py        # Dataset generation scripts (run once)
├── generate_artworks_batch2.py
├── generate_artworks_batch3.py
├── generate_artworks_batch4.py
├── generate_artworks_batch5.py
├── generate_artworks_batch6.py
├── generate_final.py
├── requirements.txt
└── README.md
```

---

## Dataset Coverage

### Movements include
Prehistoric · Ancient Egyptian · Sumerian · Greek/Hellenistic · Roman · Byzantine · Carolingian · Romanesque · Gothic · Early Netherlandish · International Gothic · Italian Gothic · Early Renaissance · High Renaissance · Mannerism · Baroque · Dutch Golden Age · Flemish Baroque · Rococo · Neoclassicism · Romanticism · Realism · Barbizon School · Pre-Raphaelitism · Impressionism · Post-Impressionism · Pointillism · Symbolism · Art Nouveau · Fauvism · Expressionism (Die Brücke, Blaue Reiter) · Cubism · Futurism · Dadaism · Surrealism · Bauhaus · Constructivism · De Stijl · Abstract Expressionism · Color Field · Pop Art · Minimalism · Conceptual Art · Land Art · Performance Art · Arte Povera · Neo-Expressionism · Appropriation Art · Young British Artists · Contemporary

### World traditions include
European · Chinese literati painting · Japanese Ukiyo-e and ink painting · Indian Mughal and Rajput miniature · Persian illuminated manuscripts · Islamic calligraphy and tile · African court art (Benin, Ife, Kuba, Dogon) · Mesoamerican (Aztec, Mayan, Olmec) · Andean (Paracas, Wari, Nazca) · Aboriginal Australian · Pacific (Māori, Melanesian) · Korean Joseon · Southeast Asian (Angkor, Borobudur, Javanese) · Pre-Columbian · Ethiopian Christian · Native American

---

## Requirements

- Python 3.10+
- See `requirements.txt` for full dependency list
