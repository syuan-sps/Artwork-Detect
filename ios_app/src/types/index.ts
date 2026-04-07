export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: number;
  movement: string;
  period: string;
  medium: string;
  museum: string;
  artist_gender: string;
  artist_nationality: string;
  color_palette: string[];
  tags: string[];
  style: string[];
  subject: string[];
  description: string;
  historical_significance: string;
}

export interface SimilarResult {
  artwork: Artwork;
  overall_score: number;
  style_score: number;
  theme_score: number;
  context_score: number;
}

export interface SearchResponse {
  query_artwork: Artwork | null;
  matched_title: string | null;
  match_score: number;
  results: SimilarResult[];
  error: string | null;
}

export interface FilterOptions {
  movements: string[];
  periods: string[];
  genders: string[];
  nationalities: string[];
  artists: string[];
}

export interface ActiveFilters {
  artist?: string;
  movement?: string;
  period?: string;
  gender?: string;
  nationality?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { artwork: Artwork; fromResults?: boolean };
  Filter: { filters: ActiveFilters; onApply: (f: ActiveFilters) => void };
};

export type TabParamList = {
  Search: undefined;
  Browse: undefined;
};
