"""
Streamlit web application for artwork similarity search.
"""

import streamlit as st
from artwork_similarity import ArtworkSimilarityEngine

st.set_page_config(
    page_title="Artwork Similarity Search",
    page_icon="🎨",
    layout="wide",
    initial_sidebar_state="expanded",
)

CUSTOM_CSS = """
<style>
  /* ---------- Global ---------- */
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');

  html, body, [class*="css"] {
      font-family: 'Inter', sans-serif;
  }

  /* ---------- Background ---------- */
  .stApp {
      background: linear-gradient(135deg, #0d0d14 0%, #1a1225 50%, #0d1420 100%);
      min-height: 100vh;
  }

  /* ---------- Sidebar ---------- */
  section[data-testid="stSidebar"] {
      background: rgba(20, 15, 35, 0.95) !important;
      border-right: 1px solid rgba(180, 130, 70, 0.3);
  }

  /* ---------- Headings ---------- */
  h1, h2, h3 {
      font-family: 'Playfair Display', serif !important;
  }

  /* ---------- Hero section ---------- */
  .hero-container {
      text-align: center;
      padding: 2.5rem 1rem 1.5rem 1rem;
  }
  .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 3.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #d4a943 0%, #f5c842 50%, #c8872a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.4rem;
  }
  .hero-subtitle {
      color: #a09080;
      font-size: 1.1rem;
      letter-spacing: 0.08em;
      font-weight: 300;
  }

  /* ---------- Search box ---------- */
  .stTextInput > div > div > input {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(180, 130, 70, 0.5) !important;
      border-radius: 12px !important;
      color: #f0e8d8 !important;
      font-size: 1.1rem !important;
      padding: 0.75rem 1rem !important;
  }
  .stTextInput > div > div > input:focus {
      border-color: #d4a943 !important;
      box-shadow: 0 0 0 2px rgba(212, 169, 67, 0.2) !important;
  }
  .stTextInput > div > div > input::placeholder {
      color: #60504a !important;
  }

  /* ---------- Source artwork card ---------- */
  .source-card {
      background: linear-gradient(135deg, rgba(212, 169, 67, 0.12), rgba(180, 130, 70, 0.08));
      border: 1px solid rgba(212, 169, 67, 0.4);
      border-radius: 16px;
      padding: 1.6rem;
      margin-bottom: 2rem;
  }
  .source-badge {
      display: inline-block;
      background: rgba(212, 169, 67, 0.2);
      border: 1px solid rgba(212, 169, 67, 0.5);
      color: #d4a943;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      padding: 0.2rem 0.65rem;
      border-radius: 20px;
      text-transform: uppercase;
      margin-bottom: 0.8rem;
  }
  .source-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.7rem;
      color: #f0e8d8;
      margin: 0.2rem 0;
  }
  .source-artist {
      color: #c8a060;
      font-size: 1rem;
      margin-bottom: 0.5rem;
  }
  .source-meta {
      color: #806860;
      font-size: 0.85rem;
  }

  /* ---------- Result card ---------- */
  .result-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.4rem;
      margin-bottom: 1.2rem;
      transition: border-color 0.2s, background 0.2s;
  }
  .result-card:hover {
      border-color: rgba(212, 169, 67, 0.35);
      background: rgba(255, 255, 255, 0.05);
  }
  .result-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      color: #f0e8d8;
      margin-bottom: 0.15rem;
  }
  .result-artist {
      color: #c8a060;
      font-size: 0.92rem;
      margin-bottom: 0.6rem;
  }

  /* ---------- Score bar ---------- */
  .score-bar-outer {
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 2px;
  }
  .score-bar-inner {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #c8872a, #d4a943, #f5c842);
  }

  /* ---------- Tag pills ---------- */
  .tag-pill {
      display: inline-block;
      background: rgba(180, 130, 70, 0.15);
      border: 1px solid rgba(180, 130, 70, 0.3);
      color: #c8a060;
      font-size: 0.72rem;
      padding: 0.15rem 0.55rem;
      border-radius: 20px;
      margin: 0.1rem 0.1rem;
  }

  /* ---------- Movement badge ---------- */
  .movement-badge {
      display: inline-block;
      background: rgba(80, 60, 120, 0.4);
      border: 1px solid rgba(120, 90, 180, 0.4);
      color: #b0a0e0;
      font-size: 0.72rem;
      font-weight: 500;
      padding: 0.15rem 0.55rem;
      border-radius: 6px;
      margin-bottom: 0.4rem;
  }

  /* ---------- Divider ---------- */
  .gold-divider {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,169,67,0.4), transparent);
      margin: 1.5rem 0;
  }

  /* ---------- Similarity scores row ---------- */
  .scores-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.8rem;
  }
  .score-item {
      flex: 1;
      min-width: 90px;
  }
  .score-label {
      color: #706060;
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 3px;
  }
  .score-value {
      color: #d4a943;
      font-size: 1rem;
      font-weight: 600;
  }

  /* ---------- Buttons ---------- */
  .stButton > button {
      background: linear-gradient(135deg, #c8872a, #d4a943) !important;
      color: #0d0d14 !important;
      border: none !important;
      border-radius: 10px !important;
      font-weight: 600 !important;
      padding: 0.6rem 1.5rem !important;
      transition: opacity 0.2s !important;
  }
  .stButton > button:hover {
      opacity: 0.88 !important;
  }

  /* ---------- Selectbox ---------- */
  .stSelectbox > div > div {
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(180,130,70,0.4) !important;
      border-radius: 10px !important;
      color: #f0e8d8 !important;
  }

  /* ---------- Slider ---------- */
  .stSlider > div > div > div > div {
      background: #d4a943 !important;
  }

  /* ---------- Description block ---------- */
  .desc-block {
      background: rgba(255,255,255,0.03);
      border-left: 3px solid rgba(212,169,67,0.5);
      padding: 0.6rem 0.9rem;
      border-radius: 0 8px 8px 0;
      color: #a09080;
      font-size: 0.88rem;
      font-style: italic;
      margin-top: 0.5rem;
  }

  /* ---------- Info boxes ---------- */
  .stInfo {
      background: rgba(80,100,160,0.15) !important;
      border: 1px solid rgba(80,100,200,0.3) !important;
  }

  /* ---------- Sidebar items ---------- */
  .sidebar-section {
      color: #a09080;
      font-size: 0.82rem;
      line-height: 1.6;
  }
  .sidebar-title {
      font-family: 'Playfair Display', serif;
      color: #d4a943;
      font-size: 1rem;
      margin-bottom: 0.4rem;
  }

  /* ---------- No results ---------- */
  .no-results {
      text-align: center;
      padding: 3rem;
      color: #605050;
  }
  .no-results-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
  }
</style>
"""

st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


@st.cache_resource(show_spinner="Loading artwork database...")
def get_engine() -> ArtworkSimilarityEngine:
    return ArtworkSimilarityEngine()


def pct(score: float) -> str:
    return f"{score * 100:.0f}%"


def score_bar(score: float) -> str:
    width = max(4, int(score * 100))
    return (
        f'<div class="score-bar-outer">'
        f'<div class="score-bar-inner" style="width:{width}%"></div>'
        f"</div>"
    )


def tag_pills(tags: list[str], limit: int = 8) -> str:
    return " ".join(
        f'<span class="tag-pill">{t}</span>'
        for t in tags[:limit]
    )


def render_source_card(artwork: dict, match_confidence: int):
    year = artwork.get("year", "unknown")
    year_str = f"{abs(year)} {'BCE' if year < 0 else 'CE'}"
    tags_html = tag_pills(artwork.get("tags", []))
    st.markdown(
        f"""
        <div class="source-card">
          <div class="source-badge">Search Query</div>
          <div class="source-title">{artwork['title']}</div>
          <div class="source-artist">by {artwork['artist']}</div>
          <div class="source-meta">
            {year_str} &nbsp;·&nbsp; {artwork.get('medium','—')} &nbsp;·&nbsp;
            {artwork.get('museum','—')}
          </div>
          <div style="margin-top:0.8rem;">{tags_html}</div>
          <div class="desc-block">{artwork.get('description','')}</div>
          <div style="margin-top:0.6rem;color:#504848;font-size:0.75rem;">
            Match confidence: {match_confidence}%
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_result_card(result: dict, rank: int):
    a = result["artwork"]
    overall = result["overall_score"]
    style_s = result["style_score"]
    theme_s = result["theme_score"]
    ctx_s = result["context_score"]

    year = a.get("year", "unknown")
    year_str = f"{abs(year)} {'BCE' if year < 0 else 'CE'}"
    tags_html = tag_pills(a.get("tags", []))
    movement = a.get("movement", "")

    st.markdown(
        f"""
        <div class="result-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div class="movement-badge">{movement}</div>
              <div class="result-title">#{rank} &nbsp; {a['title']}</div>
              <div class="result-artist">by {a['artist']} · {year_str}</div>
            </div>
            <div style="text-align:right; min-width:80px;">
              <div style="color:#d4a943; font-size:1.6rem; font-weight:700; font-family:'Playfair Display',serif;">
                {pct(overall)}
              </div>
              <div style="color:#605050; font-size:0.7rem;">similarity</div>
            </div>
          </div>

          <div class="scores-row">
            <div class="score-item">
              <div class="score-label">Style</div>
              <div class="score-value">{pct(style_s)}</div>
              {score_bar(style_s)}
            </div>
            <div class="score-item">
              <div class="score-label">Theme</div>
              <div class="score-value">{pct(theme_s)}</div>
              {score_bar(theme_s)}
            </div>
            <div class="score-item">
              <div class="score-label">Context</div>
              <div class="score-value">{pct(ctx_s)}</div>
              {score_bar(ctx_s)}
            </div>
          </div>

          <div style="margin-top:0.8rem;">{tags_html}</div>
          <div class="desc-block">{a.get('description','')}</div>
          <div style="margin-top:0.5rem; color:#504848; font-size:0.75rem;">
            {a.get('medium','—')} &nbsp;·&nbsp; {a.get('museum','—')}
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def sidebar(engine: ArtworkSimilarityEngine):
    with st.sidebar:
        st.markdown(
            '<div class="sidebar-title">Artwork Similarity Search</div>',
            unsafe_allow_html=True,
        )
        st.markdown(
            '<div class="sidebar-section">'
            "Discover artworks similar in style, theme, and historical context using "
            "TF-IDF cosine similarity across a curated dataset of 100 masterworks."
            "</div>",
            unsafe_allow_html=True,
        )
        st.markdown("<hr style='border-color:rgba(180,130,70,0.2);'>", unsafe_allow_html=True)

        st.markdown("**Settings**")
        top_n = st.slider("Results to show", min_value=1, max_value=10, value=5)
        min_score = st.slider(
            "Minimum similarity (%)", min_value=0, max_value=40, value=5
        )

        st.markdown("<hr style='border-color:rgba(180,130,70,0.2);'>", unsafe_allow_html=True)
        st.markdown("**Quick Picks**")
        quick_picks = [
            "Starry Night",
            "Mona Lisa",
            "The Scream",
            "Guernica",
            "Water Lilies",
            "The Great Wave",
            "The Kiss (Klimt)",
            "Girl with a Pearl Earring",
        ]
        selected_quick = None
        for title in quick_picks:
            if st.button(title, key=f"qp_{title}", use_container_width=True):
                selected_quick = title

        st.markdown("<hr style='border-color:rgba(180,130,70,0.2);'>", unsafe_allow_html=True)
        st.markdown(
            '<div class="sidebar-section">'
            "<b>Similarity weights:</b><br>"
            "Style/Movement — 50 %<br>"
            "Theme/Subject — 35 %<br>"
            "Context (era/museum) — 15 %"
            "</div>",
            unsafe_allow_html=True,
        )

        return top_n, min_score, selected_quick


def main():
    engine = get_engine()

    st.markdown(
        '<div class="hero-container">'
        '<div class="hero-title">Artwork Similarity Search</div>'
        '<div class="hero-subtitle">Discover masterworks that share style, theme & historical significance</div>'
        "</div>",
        unsafe_allow_html=True,
    )

    top_n, min_score_pct, quick_pick = sidebar(engine)

    if "query" not in st.session_state:
        st.session_state["query"] = ""

    if quick_pick:
        st.session_state["query"] = quick_pick

    col_search, col_btn = st.columns([5, 1])
    with col_search:
        query = st.text_input(
            label="Search",
            value=st.session_state.get("query", ""),
            placeholder='Type an artwork title or artist name, e.g. "Starry Night" or "Monet"',
            label_visibility="collapsed",
            key="search_input",
        )
    with col_btn:
        search_clicked = st.button("Search", use_container_width=True)

    st.markdown(
        '<div style="color:#504848;font-size:0.8rem;margin-top:0.3rem;margin-bottom:1.5rem;">'
        "Tip: Partial titles and misspellings are handled automatically."
        "</div>",
        unsafe_allow_html=True,
    )

    if query or search_clicked:
        if not query.strip():
            st.warning("Please enter an artwork title or artist name.")
            return

        with st.spinner("Searching..."):
            result = engine.find_similar(
                query,
                top_n=top_n,
                min_score=min_score_pct / 100,
            )

        if result["error"]:
            st.markdown(
                f'<div class="no-results">'
                f'<div class="no-results-icon">🔍</div>'
                f"<div style='color:#a08070;font-size:1.1rem;'>{result['error']}</div>"
                f"<div style='color:#504848;margin-top:0.5rem;'>Try a different spelling or browse the artwork list in the sidebar.</div>"
                f"</div>",
                unsafe_allow_html=True,
            )
            return

        render_source_card(result["query_artwork"], result["match_score"])

        if not result["results"]:
            st.markdown(
                '<div class="no-results">'
                '<div class="no-results-icon">🖼️</div>'
                "<div style='color:#a08070;'>No similar artworks found above the minimum threshold.</div>"
                "<div style='color:#504848;margin-top:0.5rem;'>Try lowering the Minimum Similarity slider.</div>"
                "</div>",
                unsafe_allow_html=True,
            )
            return

        st.markdown(
            f"<hr class='gold-divider'>"
            f"<div style='color:#806860;font-size:0.85rem;margin-bottom:1rem;'>"
            f"Found <b style='color:#d4a943;'>{len(result['results'])}</b> similar artworks</div>",
            unsafe_allow_html=True,
        )

        for rank, res in enumerate(result["results"], start=1):
            render_result_card(res, rank)

    else:
        st.markdown(
            '<div style="text-align:center; padding: 4rem 2rem; color:#504848;">'
            '<div style="font-size:4rem;margin-bottom:1rem;">🎨</div>'
            '<div style="font-family:\'Playfair Display\',serif; font-size:1.4rem; color:#705848; margin-bottom:0.8rem;">'
            "Search any artwork to discover its visual kin"
            "</div>"
            '<div style="font-size:0.9rem; line-height:1.8;">'
            "100 curated masterworks · From cave paintings to contemporary art<br>"
            "Style similarity · Thematic resonance · Historical significance"
            "</div>"
            "</div>",
            unsafe_allow_html=True,
        )


if __name__ == "__main__":
    main()
