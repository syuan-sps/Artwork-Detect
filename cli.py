#!/usr/bin/env python3
"""
Command-line interface for artwork similarity search.

Usage examples
--------------
  python cli.py search "Starry Night"
  python cli.py search "starry night" --top 8
  python cli.py list
  python cli.py info "Mona Lisa"
"""

import sys
import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.columns import Columns
from rich import box
from rich.rule import Rule

from artwork_similarity import ArtworkSimilarityEngine

console = Console()
engine = None


def get_engine() -> ArtworkSimilarityEngine:
    global engine
    if engine is None:
        with console.status("[bold gold1]Loading artwork database...[/]"):
            engine = ArtworkSimilarityEngine()
    return engine


def score_bar(score: float, width: int = 20) -> str:
    filled = int(score * width)
    bar = "█" * filled + "░" * (width - filled)
    return f"[gold1]{bar}[/gold1] [dim]{score*100:.0f}%[/dim]"


def render_artwork_panel(artwork: dict, title: str = "Artwork", style: str = "bold gold1") -> Panel:
    year = artwork.get("year", "?")
    year_str = f"{abs(year)} {'BCE' if year < 0 else ''}"
    tags = ", ".join(artwork.get("tags", [])[:6])

    lines = [
        f"[bold white]{artwork['title']}[/bold white]",
        f"[italic gold1]by {artwork['artist']}[/italic gold1]",
        f"[dim]{year_str} · {artwork.get('medium', '—')}[/dim]",
        f"[dim]{artwork.get('museum', '—')}[/dim]",
        "",
        f"[bold cyan]Movement:[/bold cyan] {artwork.get('movement', '—')}",
        f"[bold cyan]Style:[/bold cyan] {', '.join(artwork.get('style', [])[:4])}",
        f"[bold cyan]Subject:[/bold cyan] {', '.join(artwork.get('subject', [])[:4])}",
        f"[bold cyan]Colors:[/bold cyan] {', '.join(artwork.get('color_palette', [])[:5])}",
        "",
        f"[italic dim]{artwork.get('description', '')}[/italic dim]",
        "",
        f"[dim]Tags: {tags}[/dim]",
    ]
    text = Text.from_markup("\n".join(lines))
    return Panel(text, title=f"[{style}]{title}[/]", border_style="gold1", padding=(1, 2))


@click.group()
def cli():
    """Artwork Similarity Search — find artworks similar in style, theme & history."""
    pass


@cli.command()
@click.argument("query")
@click.option("--top", "-n", default=5, show_default=True, help="Number of results to return.")
@click.option("--min-score", default=5, show_default=True, help="Minimum similarity % (0-100).")
@click.option("--verbose", "-v", is_flag=True, help="Show full historical significance text.")
def search(query: str, top: int, min_score: int, verbose: bool):
    """Search for artworks similar to QUERY (title or artist name)."""
    eng = get_engine()

    result = eng.find_similar(query, top_n=top, min_score=min_score / 100)

    if result["error"]:
        console.print(f"\n[bold red]Error:[/bold red] {result['error']}\n")
        console.print("[dim]Tip: Try a partial title or artist name. Use `python cli.py list` to browse.[/dim]")
        sys.exit(1)

    console.print()
    console.print(render_artwork_panel(result["query_artwork"], title="Query Artwork"))
    console.print(f"[dim]Fuzzy match confidence: {result['match_score']}%[/dim]")
    console.print()
    console.print(Rule(title=f"[bold gold1]Top {len(result['results'])} Similar Artworks[/bold gold1]", style="gold1"))
    console.print()

    if not result["results"]:
        console.print("[dim]No similar artworks found above the threshold. Try --min-score 0.[/dim]")
        return

    for rank, res in enumerate(result["results"], start=1):
        a = res["artwork"]
        year = a.get("year", "?")
        year_str = f"{abs(year)} {'BCE' if year < 0 else ''}"

        table = Table(box=box.SIMPLE, show_header=False, padding=(0, 1))
        table.add_column("Label", style="dim", width=14)
        table.add_column("Value")

        table.add_row("Overall", score_bar(res["overall_score"]))
        table.add_row("  Style", score_bar(res["style_score"]))
        table.add_row("  Theme", score_bar(res["theme_score"]))
        table.add_row("  Context", score_bar(res["context_score"]))
        table.add_row("Movement", f"[cyan]{a.get('movement', '—')}[/cyan]")
        table.add_row("Medium", f"[dim]{a.get('medium', '—')}[/dim]")
        table.add_row("Museum", f"[dim]{a.get('museum', '—')}[/dim]")
        if verbose:
            table.add_row("History", a.get("historical_significance", "—"))

        header = (
            f"[bold gold1]#{rank}[/bold gold1]  "
            f"[bold white]{a['title']}[/bold white]  "
            f"[italic gold3]by {a['artist']}[/italic gold3]  "
            f"[dim]{year_str}[/dim]"
        )
        panel = Panel(table, title=header, border_style="dim", padding=(0, 1))
        console.print(panel)

    console.print()


@cli.command(name="list")
@click.option("--movement", "-m", default=None, help="Filter by movement keyword.")
def list_artworks(movement: str):
    """List all artworks in the database."""
    eng = get_engine()
    artworks = eng.artworks

    if movement:
        artworks = [a for a in artworks if movement.lower() in a.get("movement", "").lower()]

    table = Table(
        title=f"[bold gold1]Artwork Database[/bold gold1] ({len(artworks)} works)",
        box=box.SIMPLE_HEAVY,
        border_style="gold1",
        header_style="bold gold1",
    )
    table.add_column("#", style="dim", width=4)
    table.add_column("Title", style="bold white", min_width=30)
    table.add_column("Artist", style="gold3", min_width=20)
    table.add_column("Year", justify="right", style="dim", width=6)
    table.add_column("Movement", style="cyan", min_width=22)

    for i, a in enumerate(artworks, start=1):
        year = a.get("year", "")
        year_str = str(abs(year)) + (" BCE" if year < 0 else "") if year else "—"
        table.add_row(str(i), a["title"], a["artist"], year_str, a.get("movement", "—"))

    console.print()
    console.print(table)
    console.print()


@cli.command()
@click.argument("title")
def info(title: str):
    """Show detailed information about a specific artwork."""
    eng = get_engine()
    artwork = eng.get_artwork_by_title(title)

    if artwork is None:
        console.print(f"\n[bold red]Error:[/bold red] '{title}' not found in the database.\n")
        sys.exit(1)

    year = artwork.get("year", "?")
    year_str = f"{abs(year)} {'BCE' if year < 0 else ''}"

    console.print()
    console.print(Panel(
        f"[bold white]{artwork['title']}[/bold white]\n"
        f"[italic gold1]by {artwork['artist']}[/italic gold1]\n"
        f"[dim]{year_str} · {artwork.get('medium', '—')}[/dim]\n"
        f"[dim]{artwork.get('museum', '—')}[/dim]\n\n"
        f"[bold cyan]Movement:[/bold cyan] {artwork.get('movement', '—')}\n"
        f"[bold cyan]Style:[/bold cyan] {', '.join(artwork.get('style', []))}\n"
        f"[bold cyan]Subject:[/bold cyan] {', '.join(artwork.get('subject', []))}\n"
        f"[bold cyan]Colors:[/bold cyan] {', '.join(artwork.get('color_palette', []))}\n\n"
        f"[bold]Description:[/bold]\n{artwork.get('description', '')}\n\n"
        f"[bold]Historical Significance:[/bold]\n[italic]{artwork.get('historical_significance', '')}[/italic]\n\n"
        f"[dim]Tags: {', '.join(artwork.get('tags', []))}[/dim]",
        title=f"[bold gold1]Artwork Details[/bold gold1]",
        border_style="gold1",
        padding=(1, 2),
    ))
    console.print()


if __name__ == "__main__":
    cli()
