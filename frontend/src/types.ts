export interface Gallery {
  name: string;
  url: string;
  tier: string;
}

export interface Exhibition {
  title: string;
  artists: string;
  dates: string;
  location: string;
  status: 'past' | 'current' | 'upcoming' | 'unknown';
}

export interface ArtistProfile {
  emergingVsEstablished: string;
  nationalityPatterns: string;
  genderNotes: string;
  generationalFocus: string;
}

export interface CuratorialProfile {
  summary: string;
  pastTrends: string;
  currentHighlights: string;
  upcomingChoices: string;
  strategicTakeaway: string;
  mediums: string[];
  themes: string[];
  movements: string[];
  artistProfile: ArtistProfile;
  programmingPatterns: string;
  notableStrengths: string[];
  exhibitionCount: number;
}

export interface GalleryResult {
  gallery: {
    name: string;
    url: string;
  };
  exhibitions: Exhibition[];
  profile: CuratorialProfile;
  scrapedAt: string;
}
