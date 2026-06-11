import { ActiveFilters, FilterOptions, SearchResponse, Artwork } from '../types';

// ── Configure this to point at your running backend ──────────────────────────
// Development: run `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
// from the /workspace directory, then use your machine's LAN IP here.
// Example: 'http://192.168.1.42:8000'
// For Expo Go on a physical device, replace with your LAN IP.
// For simulator, localhost works fine.
export const API_BASE = 'http://localhost:8000';

async function get<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => get<{ status: string; artworks: number }>('/health'),

  search: (
    q: string,
    top = 8,
    minScore = 0.03,
    filters: ActiveFilters = {},
  ): Promise<SearchResponse> =>
    get<SearchResponse>('/search', {
      q,
      top,
      min_score: minScore,
      ...filters,
    }),

  getArtwork: (id: number): Promise<Artwork> =>
    get<Artwork>(`/artwork/${id}`),

  listArtworks: (opts: {
    limit?: number;
    offset?: number;
    movement?: string;
    period?: string;
    gender?: string;
    nationality?: string;
  } = {}): Promise<Artwork[]> =>
    get<Artwork[]>('/artworks', opts as Record<string, string | number>),

  filterOptions: (): Promise<FilterOptions> =>
    get<FilterOptions>('/filters'),
};
