"""
Streamlit web application for artwork similarity search.
Design: pure black / white / grey — minimal, editorial.
"""

import streamlit as st
from artwork_similarity import ArtworkSimilarityEngine

st.set_page_config(
    page_title="Artwork Similarity Search",
    page_icon="◻",
    layout="wide",
    initial_sidebar_state="expanded",
)

CSS = """
<style>
/* ── Fonts ─────────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;1,300&family=IBM+Plex+Mono:wght@300;400&display=swap');

html, body, [class*="css"] {
    font-family: 'IBM Plex Mono', monospace;
}

/* ── Palette variables ──────────────────────────────────────────── */
:root {
    --bg:     #0a0a0a;
    --bg2:    #111111;
    --bg3:    #1a1a1a;
    --border: #2a2a2a;
    --mid:    #444444;
    --muted:  #666666;
    --text:   #cccccc;
    --bright: #e8e8e8;
    --white:  #f5f5f5;
    --accent: #ffffff;
}

/* ── App background ─────────────────────────────────────────────── */
.stApp { background: var(--bg) !important; }

/* ── Sidebar ────────────────────────────────────────────────────── */
section[data-testid="stSidebar"] {
    background: var(--bg2) !important;
    border-right: 1px solid var(--border);
}
section[data-testid="stSidebar"] .stMarkdown,
section[data-testid="stSidebar"] label,
section[data-testid="stSidebar"] p {
    color: var(--muted) !important;
}

/* ── Headings ───────────────────────────────────────────────────── */
h1, h2, h3 {
    font-family: 'IBM Plex Serif', serif !important;
    color: var(--white) !important;
    font-weight: 300 !important;
    letter-spacing: -0.02em !important;
}

/* ── Search box ─────────────────────────────────────────────────── */
.stTextInput > div > div > input {
    background: var(--bg3) !important;
    border: 1px solid var(--border) !important;
    border-radius: 0 !important;
    color: var(--white) !important;
    font-family: 'IBM Plex Mono', monospace !important;
    font-size: 1rem !important;
    padding: 0.75rem 1rem !important;
    caret-color: var(--white);
}
.stTextInput > div > div > input:focus {
    border-color: var(--muted) !important;
    box-shadow: none !important;
    outline: none !important;
}
.stTextInput > div > div > input::placeholder {
    color: var(--mid) !important;
}
.stTextInput > label { display: none !important; }

/* ── Selectbox ──────────────────────────────────────────────────── */
.stSelectbox > div > div {
    background: var(--bg3) !important;
    border: 1px solid var(--border) !important;
    border-radius: 0 !important;
    color: var(--text) !important;
    font-family: 'IBM Plex Mono', monospace !important;
    font-size: 0.82rem !important;
}
.stSelectbox > label {
    color: var(--muted) !important;
    font-size: 0.75rem !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    font-family: 'IBM Plex Mono', monospace !important;
}

/* ── Slider ─────────────────────────────────────────────────────── */
.stSlider > label {
    color: var(--muted) !important;
    font-size: 0.75rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    font-family: 'IBM Plex Mono', monospace !important;
}
.stSlider > div > div > div {
    background: var(--mid) !important;
}
.stSlider > div > div > div > div {
    background: var(--white) !important;
}

/* ── Buttons ────────────────────────────────────────────────────── */
.stButton > button {
    background: transparent !important;
    border: 1px solid var(--border) !important;
    border-radius: 0 !important;
    color: var(--muted) !important;
    font-family: 'IBM Plex Mono', monospace !important;
    font-size: 0.75rem !important;
    letter-spacing: 0.05em !important;
    padding: 0.4rem 0.8rem !important;
    transition: border-color 0.15s, color 0.15s !important;
}
.stButton > button:hover {
    border-color: var(--white) !important;
    color: var(--white) !important;
}

/* ── Divider ────────────────────────────────────────────────────── */
hr {
    border: none !important;
    border-top: 1px solid var(--border) !important;
    margin: 1.5rem 0 !important;
}

/* ── Scrollbar ──────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); }

/* ── General text ───────────────────────────────────────────────── */
p, div, span { color: var(--text); }
</style>
"""

st.markdown(CSS, unsafe_allow_html=True)


@st.cache_resource(show_spinner="Loading 1,026 artworks...")
def get_engine() -> ArtworkSimilarityEngine:
    return ArtworkSimilarityEngine()


# ── helpers ──────────────────────────────────────────────────────────────

def pct(s: float) -> str:
    return f"{s * 100:.0f}%"


def bar(score: float, width: int = 24) -> str:
    filled = max(0, min(width, round(score * width)))
    return "█" * filled + "░" * (width - filled)


def tag_row(tags: list[str], limit: int = 7) -> str:
    pills = "".join(
        f'<span style="display:inline-block;margin:0 4px 3px 0;padding:1px 8px;'
        f'border:1px solid #2a2a2a;color:#555555;font-size:0.68rem;'
        f'letter-spacing:0.05em;">{t}</span>'
        for t in tags[:limit]
    )
    return f'<div style="margin-top:0.6rem;line-height:2">{pills}</div>'


def source_card(a: dict, match_pct: int) -> str:
    year = a.get("year", "")
    year_s = f"{abs(year)} {'BCE' if isinstance(year, int) and year < 0 else ''}"
    tags = tag_row(a.get("tags", []))
    return f"""
<div style="border:1px solid #2a2a2a;padding:1.6rem 2rem;margin-bottom:2rem;">
  <div style="font-size:0.68rem;letter-spacing:0.18em;color:#444;text-transform:uppercase;margin-bottom:0.8rem;">
    QUERY  ·  match confidence {match_pct}%
  </div>
  <div style="font-family:'IBM Plex Serif',serif;font-size:2rem;font-weight:300;
              color:#f0f0f0;line-height:1.15;margin-bottom:0.2rem;">
    {a['title']}
  </div>
  <div style="color:#666;font-size:0.88rem;margin-bottom:0.3rem;">
    {a['artist']}
  </div>
  <div style="color:#444;font-size:0.78rem;margin-bottom:0.8rem;">
    {year_s} &nbsp;·&nbsp; {a.get('medium','—')} &nbsp;·&nbsp; {a.get('museum','—')}
  </div>
  <div style="font-size:0.8rem;color:#555;border-left:2px solid #2a2a2a;
              padding-left:0.9rem;font-style:italic;margin-top:0.4rem;">
    {a.get('description','')}
  </div>
  {tags}
</div>
"""


def result_card(res: dict, rank: int) -> str:
    a = res["artwork"]
    year = a.get("year", "")
    year_s = f"{abs(year)} {'BCE' if isinstance(year, int) and year < 0 else ''}"
    overall = res["overall_score"]
    style_s = res["style_score"]
    theme_s = res["theme_score"]
    ctx_s = res["context_score"]
    tags = tag_row(a.get("tags", []))
    gender_s = a.get("artist_gender", "")
    nationality_s = a.get("artist_nationality", "")
    period_s = a.get("period", "")
    meta_parts = [p for p in [gender_s, nationality_s, period_s] if p]

    return f"""
<div style="border:1px solid #1e1e1e;padding:1.4rem 1.8rem;margin-bottom:1rem;
            transition:border-color 0.15s;"
     onmouseover="this.style.borderColor='#333'"
     onmouseout="this.style.borderColor='#1e1e1e'">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
    <div style="flex:1;min-width:0;">
      <div style="font-size:0.65rem;letter-spacing:0.15em;color:#444;
                  text-transform:uppercase;margin-bottom:0.5rem;">
        #{rank:02d} &nbsp; {a.get('movement','').split('/')[0].strip()}
      </div>
      <div style="font-family:'IBM Plex Serif',serif;font-size:1.35rem;font-weight:300;
                  color:#e0e0e0;line-height:1.2;margin-bottom:0.15rem;">
        {a['title']}
      </div>
      <div style="color:#555;font-size:0.82rem;">
        {a['artist']} &nbsp; <span style="color:#333">·</span> &nbsp; {year_s}
      </div>
      <div style="color:#333;font-size:0.72rem;margin-top:0.15rem;">
        {' · '.join(meta_parts)}
      </div>
    </div>
    <div style="text-align:right;min-width:60px;flex-shrink:0;">
      <div style="font-family:'IBM Plex Serif',serif;font-size:2rem;font-weight:300;
                  color:#e0e0e0;line-height:1;">{pct(overall)}</div>
      <div style="font-size:0.65rem;color:#333;letter-spacing:0.1em;">SIMILAR</div>
    </div>
  </div>

  <div style="margin-top:1.1rem;display:grid;grid-template-columns:repeat(3,1fr);gap:0.8rem;">
    {''.join(f"""
    <div>
      <div style="font-size:0.62rem;letter-spacing:0.12em;color:#3a3a3a;
                  text-transform:uppercase;margin-bottom:2px;">{label}</div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:0.78rem;color:#888;
                  margin-bottom:4px;">{pct(score)}</div>
      <div style="height:2px;background:#1a1a1a;border-radius:1px;">
        <div style="height:100%;width:{max(2,round(score*100))}%;
                    background:#555;border-radius:1px;"></div>
      </div>
    </div>""" for label, score in [("STYLE", style_s), ("THEME", theme_s), ("CONTEXT", ctx_s)])}
  </div>

  <div style="margin-top:0.9rem;font-size:0.78rem;color:#444;
              border-left:2px solid #1e1e1e;padding-left:0.8rem;font-style:italic;">
    {a.get('description','')}
  </div>
  {tags}
  <div style="margin-top:0.6rem;font-size:0.7rem;color:#333;">
    {a.get('medium','—')} &nbsp;·&nbsp; {a.get('museum','—')}
  </div>
</div>
"""


def empty_state() -> str:
    return """
<div style="text-align:center;padding:5rem 2rem;color:#282828;">
  <div style="font-family:'IBM Plex Serif',serif;font-size:3rem;font-weight:300;
              color:#1e1e1e;margin-bottom:1rem;">◻</div>
  <div style="font-family:'IBM Plex Serif',serif;font-size:1.3rem;color:#333;
              margin-bottom:0.6rem;">Search any artwork</div>
  <div style="font-size:0.8rem;color:#2a2a2a;line-height:1.8;">
    1,026 works · 115 nationalities · 291 movements<br>
    type a title, artist name, or partial spelling
  </div>
</div>
"""


# ── sidebar ───────────────────────────────────────────────────────────────

def render_sidebar(engine: ArtworkSimilarityEngine):
    with st.sidebar:
        st.markdown(
            '<div style="font-family:IBM Plex Serif,serif;font-size:1.05rem;'
            'color:#888;font-weight:300;margin-bottom:0.3rem;">Filters</div>',
            unsafe_allow_html=True,
        )
        st.markdown(
            '<div style="font-size:0.7rem;color:#333;line-height:1.7;margin-bottom:1rem;">'
            "Narrow results by artist, period, movement, gender, or nationality."
            "</div>",
            unsafe_allow_html=True,
        )

        # ── Artist ──
        artists = [""] + engine.get_artists()
        artist_filter = st.selectbox(
            "ARTIST",
            options=artists,
            format_func=lambda x: "— any —" if x == "" else x,
            key="f_artist",
        )

        # ── Movement ──
        movements = [""] + engine.get_movements()
        movement_filter = st.selectbox(
            "MOVEMENT",
            options=movements,
            format_func=lambda x: "— any —" if x == "" else x,
            key="f_movement",
        )

        # ── Period ──
        periods = [""] + engine.get_periods()
        period_filter = st.selectbox(
            "PERIOD",
            options=periods,
            format_func=lambda x: "— any —" if x == "" else x,
            key="f_period",
        )

        # ── Gender ──
        genders = [""] + engine.get_genders()
        gender_filter = st.selectbox(
            "ARTIST GENDER",
            options=genders,
            format_func=lambda x: "— any —" if x == "" else x,
            key="f_gender",
        )

        # ── Nationality ──
        nationalities = [""] + engine.get_nationalities()
        nationality_filter = st.selectbox(
            "NATIONALITY",
            options=nationalities,
            format_func=lambda x: "— any —" if x == "" else x,
            key="f_nationality",
        )

        st.markdown("<hr>", unsafe_allow_html=True)
        st.markdown(
            '<div style="font-size:0.7rem;color:#333;text-transform:uppercase;'
            'letter-spacing:0.12em;margin-bottom:0.6rem;">Settings</div>',
            unsafe_allow_html=True,
        )
        top_n = st.slider("RESULTS", min_value=1, max_value=15, value=5, key="top_n")
        min_score = st.slider("MIN SIMILARITY %", min_value=0, max_value=30, value=3, key="min_s")

        st.markdown("<hr>", unsafe_allow_html=True)
        st.markdown(
            '<div style="font-size:0.7rem;color:#2a2a2a;text-transform:uppercase;'
            'letter-spacing:0.12em;margin-bottom:0.6rem;">Quick Search</div>',
            unsafe_allow_html=True,
        )
        quick = [
            "Starry Night",
            "Mona Lisa",
            "The Scream",
            "Guernica",
            "Water Lilies",
            "The Great Wave",
            "The Kiss",
            "Girl with a Pearl Earring",
            "Nighthawks",
            "The Persistence of Memory",
        ]
        selected_quick = None
        for title in quick:
            if st.button(title, key=f"q_{title}", use_container_width=True):
                selected_quick = title

        st.markdown("<hr>", unsafe_allow_html=True)
        st.markdown(
            '<div style="font-size:0.67rem;color:#2a2a2a;line-height:1.8;">'
            "Style · 50 %<br>Theme · 35 %<br>Context · 15 %"
            "</div>",
            unsafe_allow_html=True,
        )

        filters = {
            "artist": artist_filter,
            "movement": movement_filter,
            "period": period_filter,
            "gender": gender_filter,
            "nationality": nationality_filter,
        }
        return top_n, min_score, selected_quick, filters


# ── main ──────────────────────────────────────────────────────────────────

def main():
    engine = get_engine()

    # Header
    st.markdown(
        '<div style="padding:2rem 0 1rem 0;">'
        '<div style="font-family:IBM Plex Serif,serif;font-size:2.5rem;font-weight:300;'
        'color:#e0e0e0;letter-spacing:-0.03em;line-height:1.1;">Artwork Similarity Search</div>'
        '<div style="font-size:0.75rem;color:#3a3a3a;letter-spacing:0.12em;margin-top:0.4rem;">'
        '1,026 MASTERWORKS &nbsp;·&nbsp; STYLE · THEME · HISTORY'
        '</div></div>',
        unsafe_allow_html=True,
    )

    top_n, min_score_pct, quick_pick, filters = render_sidebar(engine)

    # Quick pick triggers
    if quick_pick:
        st.session_state["search_query"] = quick_pick

    # Search input
    query = st.text_input(
        label="search",
        value=st.session_state.get("search_query", ""),
        placeholder='title, artist name, or partial spelling — e.g. "starry night"',
        key="search_input",
    )

    st.markdown(
        '<div style="font-size:0.7rem;color:#2a2a2a;margin-top:-0.3rem;margin-bottom:1.5rem;">'
        "Fuzzy matching handles misspellings and partial titles automatically."
        "</div>",
        unsafe_allow_html=True,
    )

    # ── run search ────────────────────────────────────────────────────────
    if not query or not query.strip():
        st.markdown(empty_state(), unsafe_allow_html=True)
        return

    active_filters = {k: v for k, v in filters.items() if v}

    with st.spinner(""):
        result = engine.find_similar(
            query,
            top_n=top_n,
            min_score=min_score_pct / 100,
            filters=active_filters if active_filters else None,
        )

    if result["error"]:
        st.markdown(
            f'<div style="padding:2rem;color:#444;border:1px solid #1e1e1e;text-align:center;">'
            f'<div style="font-size:0.85rem;">{result["error"]}</div>'
            f'<div style="font-size:0.7rem;color:#2a2a2a;margin-top:0.5rem;">'
            f'Try a different spelling or use the quick-search buttons in the sidebar.</div>'
            f'</div>',
            unsafe_allow_html=True,
        )
        return

    st.markdown(source_card(result["query_artwork"], result["match_score"]), unsafe_allow_html=True)

    if not result["results"]:
        msg = "No similar artworks found above the threshold."
        if active_filters:
            msg += " Try removing some filters or lowering the minimum similarity."
        else:
            msg += " Try lowering the minimum similarity slider."
        st.markdown(
            f'<div style="padding:2rem;color:#333;border:1px solid #1a1a1a;text-align:center;'
            f'font-size:0.82rem;">{msg}</div>',
            unsafe_allow_html=True,
        )
        return

    filter_info = ""
    if active_filters:
        kv = " · ".join(f"{k.upper()}={v}" for k, v in active_filters.items())
        filter_info = f' &nbsp;<span style="color:#333;">({kv})</span>'

    st.markdown(
        f'<div style="font-size:0.68rem;letter-spacing:0.12em;color:#333;'
        f'text-transform:uppercase;margin-bottom:1rem;">'
        f'{len(result["results"])} SIMILAR ARTWORKS{filter_info}'
        f'</div>',
        unsafe_allow_html=True,
    )

    for rank, res in enumerate(result["results"], start=1):
        st.markdown(result_card(res, rank), unsafe_allow_html=True)


if __name__ == "__main__":
    main()
