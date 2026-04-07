export interface Exhibition {
  title: string;
  artists: string;
  dates: string;
  location: string;
}

export interface ArtistProfile {
  emergingVsEstablished: string;
  nationalityPatterns: string;
  genderNotes: string;
  generationalFocus: string;
}

export interface CuratorialProfile {
  summary: string;
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
