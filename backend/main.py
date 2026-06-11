"""
FastAPI backend for Artwork Similarity Search.
Exposes the Python similarity engine as a JSON REST API
for consumption by the iOS app (or any HTTP client).
"""

import sys
from pathlib import Path

# Make the parent directory (where artwork_similarity.py lives) importable
sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from artwork_similarity import ArtworkSimilarityEngine

# ── singleton engine (loaded once at startup) ────────────────────────────────
engine = ArtworkSimilarityEngine()

app = FastAPI(
    title="Artwork Similarity API",
    description="Find artworks similar in style, theme, and historical significance.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── response models ──────────────────────────────────────────────────────────

class ArtworkBrief(BaseModel):
    id: int
    title: str
    artist: str
    year: int
    movement: str
    period: str
    medium: str
    museum: str
    artist_gender: str
    artist_nationality: str
    color_palette: list[str]
    tags: list[str]
    style: list[str]
    subject: list[str]
    description: str
    historical_significance: str


class SimilarResult(BaseModel):
    artwork: ArtworkBrief
    overall_score: float
    style_score: float
    theme_score: float
    context_score: float


class SearchResponse(BaseModel):
    query_artwork: Optional[ArtworkBrief]
    matched_title: Optional[str]
    match_score: int
    results: list[SimilarResult]
    error: Optional[str]


class FilterOptions(BaseModel):
    movements: list[str]
    periods: list[str]
    genders: list[str]
    nationalities: list[str]
    artists: list[str]


def _to_brief(artwork: dict) -> ArtworkBrief:
    return ArtworkBrief(
        id=artwork.get("id", 0),
        title=artwork.get("title", ""),
        artist=artwork.get("artist", ""),
        year=artwork.get("year", 0),
        movement=artwork.get("movement", ""),
        period=artwork.get("period", ""),
        medium=artwork.get("medium", ""),
        museum=artwork.get("museum", ""),
        artist_gender=artwork.get("artist_gender", "unknown"),
        artist_nationality=artwork.get("artist_nationality", ""),
        color_palette=artwork.get("color_palette", []),
        tags=artwork.get("tags", []),
        style=artwork.get("style", []),
        subject=artwork.get("subject", []),
        description=artwork.get("description", ""),
        historical_significance=artwork.get("historical_significance", ""),
    )


# ── endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "artworks": len(engine.artworks)}


@app.get("/search", response_model=SearchResponse)
def search(
    q: str = Query(..., description="Artwork title, partial title, or artist name"),
    top: int = Query(8, ge=1, le=30, description="Max results"),
    min_score: float = Query(0.03, ge=0.0, le=1.0, description="Min similarity score"),
    artist: Optional[str] = Query(None),
    movement: Optional[str] = Query(None),
    period: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    nationality: Optional[str] = Query(None),
):
    filters = {k: v for k, v in {
        "artist": artist or "",
        "movement": movement or "",
        "period": period or "",
        "gender": gender or "",
        "nationality": nationality or "",
    }.items() if v}

    result = engine.find_similar(
        query=q,
        top_n=top,
        min_score=min_score,
        filters=filters if filters else None,
    )

    return SearchResponse(
        query_artwork=_to_brief(result["query_artwork"]) if result["query_artwork"] else None,
        matched_title=result.get("matched_title"),
        match_score=result.get("match_score", 0),
        results=[
            SimilarResult(
                artwork=_to_brief(r["artwork"]),
                overall_score=r["overall_score"],
                style_score=r["style_score"],
                theme_score=r["theme_score"],
                context_score=r["context_score"],
            )
            for r in result["results"]
        ],
        error=result.get("error"),
    )


@app.get("/artwork/{artwork_id}", response_model=ArtworkBrief)
def get_artwork(artwork_id: int):
    artworks = [a for a in engine.artworks if a.get("id") == artwork_id]
    if not artworks:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return _to_brief(artworks[0])


@app.get("/artworks", response_model=list[ArtworkBrief])
def list_artworks(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    movement: Optional[str] = Query(None),
    period: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    nationality: Optional[str] = Query(None),
):
    artworks = engine.artworks
    if movement:
        artworks = [a for a in artworks if movement.lower() in a.get("movement", "").lower()]
    if period:
        artworks = [a for a in artworks if a.get("period", "") == period]
    if gender:
        artworks = [a for a in artworks if a.get("artist_gender", "").lower() == gender.lower()]
    if nationality:
        artworks = [a for a in artworks if nationality.lower() in a.get("artist_nationality", "").lower()]
    return [_to_brief(a) for a in artworks[offset: offset + limit]]


@app.get("/filters", response_model=FilterOptions)
def get_filter_options():
    return FilterOptions(
        movements=engine.get_movements(),
        periods=engine.get_periods(),
        genders=engine.get_genders(),
        nationalities=engine.get_nationalities(),
        artists=engine.get_artists(),
    )
