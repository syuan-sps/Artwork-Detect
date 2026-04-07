"""
Core artwork similarity search engine.

Computes similarity across three dimensions:
  - Visual/Style: movement, style tags, medium, color palette
  - Thematic: subject, historical significance keywords, description
  - Contextual: artist, year period, museum location

TF-IDF vectors are built for each dimension and combined into a
weighted composite score so that style matches count most heavily.
Fuzzy matching is used to handle misspellings in the query.

Filters supported:
  - artist       – exact or partial artist name match
  - movement     – partial movement string match
  - period       – exact period match
  - gender       – artist_gender field  ("male", "female", "unknown", "non-binary")
  - nationality  – partial artist_nationality match
"""

import json
from pathlib import Path
from typing import Optional

import numpy as np
from fuzzywuzzy import fuzz, process
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DATA_PATH = Path(__file__).parent / "data" / "artworks.json"

STYLE_WEIGHT = 0.50
THEME_WEIGHT = 0.35
CONTEXT_WEIGHT = 0.15

FUZZY_MATCH_THRESHOLD = 55


def _load_artworks() -> list[dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _build_style_doc(artwork: dict) -> str:
    parts = [
        artwork.get("movement", ""),
        artwork.get("medium", ""),
        " ".join(artwork.get("style", [])),
        " ".join(artwork.get("color_palette", [])),
        " ".join(artwork.get("tags", [])),
    ]
    return " ".join(p for p in parts if p)


def _build_theme_doc(artwork: dict) -> str:
    parts = [
        " ".join(artwork.get("subject", [])),
        artwork.get("description", ""),
        artwork.get("historical_significance", ""),
        " ".join(artwork.get("tags", [])),
    ]
    return " ".join(p for p in parts if p)


def _build_context_doc(artwork: dict) -> str:
    year = artwork.get("year", 0)
    if year < 1400:
        era = "medieval ancient early"
    elif year < 1600:
        era = "renaissance early modern"
    elif year < 1700:
        era = "baroque early modern"
    elif year < 1800:
        era = "baroque rococo neoclassicism"
    elif year < 1900:
        era = "19th century romantic realist impressionist"
    elif year < 1945:
        era = "modern 20th century avant garde"
    elif year < 1980:
        era = "post-war contemporary modern"
    else:
        era = "contemporary postmodern late modern"

    parts = [
        artwork.get("artist", ""),
        artwork.get("museum", ""),
        era,
        artwork.get("movement", ""),
        artwork.get("artist_nationality", ""),
    ]
    return " ".join(p for p in parts if p)


class ArtworkSimilarityEngine:
    """
    Loads the artwork dataset and builds TF-IDF matrices for similarity search.

    Call `find_similar(query)` with a title (or partial title) to get results.
    Optional `filters` dict narrows the candidate pool before ranking.
    """

    def __init__(self):
        self.artworks = _load_artworks()
        self._build_vectors()

    # ── index building ───────────────────────────────────────────────────

    def _build_vectors(self):
        style_docs = [_build_style_doc(a) for a in self.artworks]
        theme_docs = [_build_theme_doc(a) for a in self.artworks]
        context_docs = [_build_context_doc(a) for a in self.artworks]

        self._style_vec = TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)
        self._theme_vec = TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)
        self._context_vec = TfidfVectorizer(ngram_range=(1, 1), min_df=1, sublinear_tf=True)

        self._style_matrix = self._style_vec.fit_transform(style_docs)
        self._theme_matrix = self._theme_vec.fit_transform(theme_docs)
        self._context_matrix = self._context_vec.fit_transform(context_docs)

        self._titles = [a["title"] for a in self.artworks]

    # ── query resolution ─────────────────────────────────────────────────

    def _resolve_query(self, query: str) -> Optional[int]:
        """
        Find the best-matching artwork index for a free-form query string.
        Tries exact match → fuzzy title match → artist name match.
        Returns None if nothing exceeds the fuzzy threshold.
        """
        query_lower = query.strip().lower()

        # Exact title match (case-insensitive)
        for i, title in enumerate(self._titles):
            if title.lower() == query_lower:
                return i

        # Fuzzy title match
        result = process.extractOne(
            query,
            self._titles,
            scorer=fuzz.token_sort_ratio,
        )
        if result is not None:
            match, score = result[0], result[1]
            if score >= FUZZY_MATCH_THRESHOLD:
                return self._titles.index(match)

        # Fallback: artist name partial match
        for i, artwork in enumerate(self.artworks):
            artist_lower = artwork.get("artist", "").lower()
            if query_lower in artist_lower or artist_lower in query_lower:
                return i

        return None

    # ── filtering helpers ────────────────────────────────────────────────

    @staticmethod
    def _artwork_matches_filters(artwork: dict, filters: dict) -> bool:
        """Return True if the artwork satisfies all provided filters."""
        if not filters:
            return True

        artist_f = filters.get("artist", "").strip().lower()
        if artist_f and artist_f not in artwork.get("artist", "").lower():
            return False

        movement_f = filters.get("movement", "").strip().lower()
        if movement_f and movement_f not in artwork.get("movement", "").lower():
            return False

        period_f = filters.get("period", "").strip()
        if period_f and period_f != artwork.get("period", ""):
            return False

        gender_f = filters.get("gender", "").strip().lower()
        if gender_f and gender_f != artwork.get("artist_gender", "").lower():
            return False

        nationality_f = filters.get("nationality", "").strip().lower()
        if nationality_f and nationality_f not in artwork.get("artist_nationality", "").lower():
            return False

        return True

    # ── similarity computation ───────────────────────────────────────────

    def _compute_composite_similarity(self, idx: int) -> np.ndarray:
        style_scores = cosine_similarity(
            self._style_matrix[idx], self._style_matrix
        ).flatten()
        theme_scores = cosine_similarity(
            self._theme_matrix[idx], self._theme_matrix
        ).flatten()
        context_scores = cosine_similarity(
            self._context_matrix[idx], self._context_matrix
        ).flatten()

        return (
            STYLE_WEIGHT * style_scores
            + THEME_WEIGHT * theme_scores
            + CONTEXT_WEIGHT * context_scores
        )

    # ── public API ───────────────────────────────────────────────────────

    def find_similar(
        self,
        query: str,
        top_n: int = 5,
        min_score: float = 0.03,
        filters: Optional[dict] = None,
    ) -> dict:
        """
        Search for artworks similar to `query`.

        Parameters
        ----------
        query : str
            Artwork title, partial title, or artist name.
        top_n : int
            Maximum number of similar artworks to return.
        min_score : float
            Minimum composite similarity score (0–1) to include a result.
        filters : dict, optional
            Keys: artist, movement, period, gender, nationality.
            Each is a partial-match string (case-insensitive), except `period`
            which requires an exact match from PERIODS list.

        Returns
        -------
        dict with:
            query_artwork   – matched source artwork
            results         – list of {artwork, overall_score, style_score,
                               theme_score, context_score}
            matched_title   – canonical title of the matched artwork
            match_score     – fuzzy confidence (0–100)
            error           – None or an error string
        """
        idx = self._resolve_query(query)

        if idx is None:
            return {
                "query_artwork": None,
                "results": [],
                "matched_title": None,
                "match_score": 0,
                "error": f"No artwork matching '{query}' found in the database.",
            }

        _fr = process.extractOne(query, self._titles, scorer=fuzz.token_sort_ratio)
        fuzzy_score = _fr[1] if _fr else 0

        composite = self._compute_composite_similarity(idx)
        composite[idx] = -1.0  # exclude query artwork itself

        ranked = np.argsort(composite)[::-1]

        results = []
        for rank_idx in ranked:
            if composite[rank_idx] < min_score:
                break
            if len(results) >= top_n:
                break

            artwork = self.artworks[rank_idx]

            # Apply filters to result pool
            if filters and not self._artwork_matches_filters(artwork, filters):
                continue

            style_s = float(cosine_similarity(
                self._style_matrix[idx], self._style_matrix[rank_idx]
            ).flatten()[0])
            theme_s = float(cosine_similarity(
                self._theme_matrix[idx], self._theme_matrix[rank_idx]
            ).flatten()[0])
            context_s = float(cosine_similarity(
                self._context_matrix[idx], self._context_matrix[rank_idx]
            ).flatten()[0])

            results.append({
                "artwork": artwork,
                "overall_score": float(composite[rank_idx]),
                "style_score": style_s,
                "theme_score": theme_s,
                "context_score": context_s,
            })

        return {
            "query_artwork": self.artworks[idx],
            "results": results,
            "matched_title": self._titles[idx],
            "match_score": fuzzy_score,
            "error": None,
        }

    def list_artworks(self) -> list[str]:
        """Return all artwork titles."""
        return list(self._titles)

    def get_artwork_by_title(self, title: str) -> Optional[dict]:
        idx = self._resolve_query(title)
        return self.artworks[idx] if idx is not None else None

    # ── filter option helpers ─────────────────────────────────────────────

    def get_movements(self) -> list[str]:
        """Sorted unique movement strings (first part before '/')."""
        seen = set()
        result = []
        for a in self.artworks:
            m = a.get("movement", "").split("/")[0].strip()
            if m and m not in seen:
                seen.add(m)
                result.append(m)
        return sorted(result)

    def get_periods(self) -> list[str]:
        """Sorted unique period strings."""
        return sorted(set(a.get("period", "") for a in self.artworks if a.get("period")))

    def get_genders(self) -> list[str]:
        return sorted(set(a.get("artist_gender", "") for a in self.artworks if a.get("artist_gender")))

    def get_nationalities(self) -> list[str]:
        return sorted(set(a.get("artist_nationality", "") for a in self.artworks if a.get("artist_nationality")))

    def get_artists(self) -> list[str]:
        return sorted(set(a.get("artist", "") for a in self.artworks if a.get("artist")))
