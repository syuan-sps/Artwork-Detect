"""
Core artwork similarity search engine.

Computes similarity across three dimensions:
  - Visual/Style: movement, style tags, medium, color palette
  - Thematic: subject, historical significance keywords, description
  - Contextual: artist, year period, museum location

TF-IDF vectors are built for each dimension and combined into a
weighted composite score so that style matches count most heavily.
Fuzzy matching is used to handle misspellings in the query.
"""

import json
import os
import re
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

FUZZY_MATCH_THRESHOLD = 60


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
    elif year < 1800:
        era = "baroque rococo early modern"
    elif year < 1900:
        era = "19th century romantic realist impressionist"
    elif year < 1960:
        era = "modern 20th century avant garde"
    else:
        era = "contemporary postmodern late modern"

    parts = [
        artwork.get("artist", ""),
        artwork.get("museum", ""),
        era,
        artwork.get("movement", ""),
    ]
    return " ".join(p for p in parts if p)


class ArtworkSimilarityEngine:
    """
    Loads the artwork dataset and builds TF-IDF matrices for similarity search.
    Call `find_similar(query)` with a title (or partial title) to get results.
    """

    def __init__(self):
        self.artworks = _load_artworks()
        self._build_vectors()

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

    def _resolve_query(self, query: str) -> Optional[int]:
        """
        Find the best-matching artwork index for a free-form query string.
        Returns None if no match exceeds the fuzzy threshold.
        """
        query_lower = query.strip().lower()

        for i, title in enumerate(self._titles):
            if title.lower() == query_lower:
                return i

        result = process.extractOne(
            query,
            self._titles,
            scorer=fuzz.token_sort_ratio,
        )
        if result is None:
            return None
        match, score = result[0], result[1]
        if score >= FUZZY_MATCH_THRESHOLD:
            return self._titles.index(match)

        for i, artwork in enumerate(self.artworks):
            artist_lower = artwork.get("artist", "").lower()
            if query_lower in artist_lower or artist_lower in query_lower:
                return i

        return None

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

        composite = (
            STYLE_WEIGHT * style_scores
            + THEME_WEIGHT * theme_scores
            + CONTEXT_WEIGHT * context_scores
        )
        return composite

    def find_similar(
        self,
        query: str,
        top_n: int = 5,
        min_score: float = 0.05,
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
            Minimum composite similarity score to include a result.

        Returns
        -------
        dict with keys:
            query_artwork   – the matched source artwork dict
            results         – list of dicts with artwork + similarity scores
            matched_title   – canonical title of the matched artwork
            match_score     – fuzzy match confidence (0-100)
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

        _fuzzy_result = process.extractOne(
            query,
            self._titles,
            scorer=fuzz.token_sort_ratio,
        )
        fuzzy_match = _fuzzy_result[0] if _fuzzy_result else ""
        fuzzy_score = _fuzzy_result[1] if _fuzzy_result else 0

        composite = self._compute_composite_similarity(idx)

        composite[idx] = -1.0

        ranked = np.argsort(composite)[::-1]

        results = []
        for rank_idx in ranked:
            if composite[rank_idx] < min_score:
                break
            if len(results) >= top_n:
                break
            artwork = self.artworks[rank_idx]
            style_s = cosine_similarity(
                self._style_matrix[idx], self._style_matrix[rank_idx]
            ).flatten()[0]
            theme_s = cosine_similarity(
                self._theme_matrix[idx], self._theme_matrix[rank_idx]
            ).flatten()[0]
            context_s = cosine_similarity(
                self._context_matrix[idx], self._context_matrix[rank_idx]
            ).flatten()[0]
            results.append(
                {
                    "artwork": artwork,
                    "overall_score": float(composite[rank_idx]),
                    "style_score": float(style_s),
                    "theme_score": float(theme_s),
                    "context_score": float(context_s),
                }
            )

        return {
            "query_artwork": self.artworks[idx],
            "results": results,
            "matched_title": self._titles[idx],
            "match_score": fuzzy_score,
            "error": None,
        }

    def list_artworks(self) -> list[str]:
        """Return all artwork titles in the database."""
        return list(self._titles)

    def get_artwork_by_title(self, title: str) -> Optional[dict]:
        idx = self._resolve_query(title)
        return self.artworks[idx] if idx is not None else None
