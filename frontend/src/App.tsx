import { useMemo, useState } from "react";
import "./App.css";

type Gallery = {
  id: string;
  name: string;
  neighborhood: string;
  focus: string;
  hours: string;
};

const GALLERIES: Gallery[] = [
  {
    id: "1",
    name: "West 25th Contemporary",
    neighborhood: "Chelsea · W 25th St",
    focus: "Emerging painting & installation",
    hours: "Tue–Sat · 11–6",
  },
  {
    id: "2",
    name: "Tenth Avenue Annex",
    neighborhood: "Chelsea · 10th Ave",
    focus: "Large-scale photography",
    hours: "Wed–Sun · 12–7",
  },
  {
    id: "3",
    name: "Rail Line Project Space",
    neighborhood: "Chelsea · The High Line",
    focus: "Sculpture & public programs",
    hours: "Thu–Sat · 10–5",
  },
  {
    id: "4",
    name: "Brick Loft Gallery",
    neighborhood: "Chelsea · W 26th St",
    focus: "Minimalist & conceptual",
    hours: "Tue–Fri · 11–6",
  },
  {
    id: "5",
    name: "Industrial Room 4B",
    neighborhood: "Chelsea · W 24th St",
    focus: "Video & sound",
    hours: "By appointment",
  },
  {
    id: "6",
    name: "Sidewalk Level Studio",
    neighborhood: "Chelsea · W 27th St",
    focus: "Mixed media & editions",
    hours: "Mon–Sat · 10–6",
  },
];

function App() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GALLERIES;
    return GALLERIES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.focus.toLowerCase().includes(q) ||
        g.neighborhood.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="app">
      <div className="app__texture" aria-hidden="true" />

      <header className="hero">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__fog" aria-hidden="true" />

        <div className="hero__inner">
          <p className="hero__eyebrow">Chelsea · Manhattan</p>
          <h1 className="hero__title">
            <span className="hero__title-line">Gallery</span>
            <span className="hero__title-line hero__title-line--accent">
              Profiler
            </span>
          </h1>
          <p className="hero__tagline">
            West 25th after hours — steel, brick, and the quiet hum of the art
            trade. Map the corridor. Read the room.
          </p>

          <div className="search">
            <label className="search__label" htmlFor="gallery-search">
              Search galleries
            </label>
            <div className="search__field">
              <span className="search__icon" aria-hidden="true" />
              <input
                id="gallery-search"
                type="search"
                className="search__input"
                placeholder="Name, medium, street…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="main__bar">
          <h2 className="main__heading">Directory</h2>
          <p className="main__meta">
            {filtered.length} space{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <ul className="card-grid">
          {filtered.map((g) => (
            <li key={g.id}>
              <article className="card">
                <div className="card__frame">
                  <div className="card__pane">
                    <h3 className="card__name">{g.name}</h3>
                    <p className="card__loc">{g.neighborhood}</p>
                    <p className="card__focus">{g.focus}</p>
                    <p className="card__hours">{g.hours}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="empty">No matches along this block.</p>
        )}
      </main>

      <footer className="footer">
        <span>Chelsea Gallery Profiler</span>
        <span className="footer__rule" aria-hidden="true" />
        <span>Industrial elegance · NYC art world</span>
      </footer>
    </div>
  );
}

export default App;
