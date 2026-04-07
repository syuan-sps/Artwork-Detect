# Artwork Similarity Search

Find artworks that are similar to any given piece in terms of **visual style**, **thematic content**, and **historical significance**.

## How It Works

The engine computes similarity across three weighted dimensions:

| Dimension | Weight | What it captures |
|-----------|--------|-----------------|
| **Style** | 50 % | Art movement, style tags, medium, color palette |
| **Theme** | 35 % | Subject matter, description, historical significance |
| **Context** | 15 % | Artist, era/period, museum location |

Each dimension uses a **TF-IDF vectorizer** with **cosine similarity**. The three scores are combined into a single weighted composite. **Fuzzy matching** handles misspellings and partial titles in the query.

The dataset contains **100 curated masterworks** spanning every major movement — from Early Netherlandish and Renaissance through Baroque, Romanticism, Impressionism, Cubism, Surrealism, Abstract Expressionism, Pop Art, Minimalism, and Contemporary Art.

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

Then open [http://localhost:8501](http://localhost:8501) in your browser.

### 3. Use the command-line interface

```bash
# Search for similar artworks
python cli.py search "Starry Night"

# Limit to 8 results and lower the similarity threshold
python cli.py search "Monet" --top 8 --min-score 3

# Include full historical significance text
python cli.py search "Mona Lisa" -v

# List all 100 artworks in the database
python cli.py list

# Filter by movement
python cli.py list --movement Impressionism

# Show full details for one artwork
python cli.py info "The Scream"
```

### 4. Use as a Python library

```python
from artwork_similarity import ArtworkSimilarityEngine

engine = ArtworkSimilarityEngine()

# Find 5 artworks similar to "Starry Night"
result = engine.find_similar("Starry Night", top_n=5)

source = result["query_artwork"]
print(f"Searching from: {source['title']} by {source['artist']}")

for res in result["results"]:
    a = res["artwork"]
    print(f"  {a['title']} ({a['year']}) — {res['overall_score']*100:.0f}% similar")
```

---

## Project Structure

```
artwork-similarity-search/
├── artwork_similarity.py   # Core TF-IDF similarity engine
├── app.py                  # Streamlit web application
├── cli.py                  # Rich terminal CLI
├── data/
│   └── artworks.json       # 100-artwork dataset with rich metadata
├── requirements.txt
└── README.md
```

---

## Dataset

Each artwork entry includes:
- `title`, `artist`, `year`, `medium`
- `movement` — art historical movement
- `style` — list of descriptive style keywords
- `subject` — list of subject/content keywords
- `color_palette` — dominant colors
- `museum` — current location
- `description` — prose description
- `historical_significance` — cultural/historical context
- `tags` — combined keyword tags used for search

### Movements covered

Early Netherlandish · Northern Renaissance · High Renaissance · Baroque · Dutch Golden Age · Rococo · Neoclassicism · Romanticism · Realism · Impressionism · Post-Impressionism · Pointillism · Art Nouveau · Fauvism · Expressionism · Cubism · Surrealism · Abstract Expressionism · Color Field · Pop Art · Minimalism · Conceptual Art · Contemporary Art · and more.

---

## Requirements

- Python 3.10+
- See `requirements.txt` for full dependency list
