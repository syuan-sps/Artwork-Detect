import React, { useState, FormEvent, useEffect, useRef } from 'react';
import './App.css';
import { fetchGalleryProfile, fetchGalleryList } from './api';
import { GalleryResult, Exhibition, CuratorialProfile, Gallery } from './types';

// ─── Sub-components ──────────────────────────────────────────────────────────

function TagList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span className="profile-field-value">—</span>;
  return (
    <div className="tag-list">
      {items.map((item, i) => (
        <span key={i} className="tag">{item}</span>
      ))}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  current: '#1a7a4a',
  upcoming: '#1a4a7a',
  past: '#888',
  unknown: 'transparent',
};

function ExhibitionGroup({ label, exhibitions, color }: { label: string; exhibitions: Exhibition[]; color: string }) {
  if (exhibitions.length === 0) return null;
  return (
    <div className="exhibition-group">
      <div className="exhibition-group-header" style={{ color }}>
        <span className="exhibition-group-dot" style={{ background: color }} />
        {label} <span className="exhibition-group-count">({exhibitions.length})</span>
      </div>
      {exhibitions.map((ex, i) => (
        <div key={i} className="exhibition-item">
          <div>
            <div className="exhibition-title">{ex.title}</div>
            {ex.artists && <div className="exhibition-artists">{ex.artists}</div>}
          </div>
          <div className="exhibition-right">
            {ex.dates && <div className="exhibition-dates">{ex.dates}</div>}
            {ex.location && <div className="exhibition-location">{ex.location}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExhibitionTimeline({ exhibitions }: { exhibitions: Exhibition[] }) {
  if (!exhibitions || exhibitions.length === 0) {
    return (
      <div className="empty-state">
        No exhibition data could be scraped from this gallery's website.
      </div>
    );
  }

  const current = exhibitions.filter(e => e.status === 'current');
  const upcoming = exhibitions.filter(e => e.status === 'upcoming');
  const past = exhibitions.filter(e => e.status === 'past');
  const unknown = exhibitions.filter(e => e.status === 'unknown');

  return (
    <>
      <div className="exhibition-count-bar">
        {exhibitions.length} exhibition{exhibitions.length !== 1 ? 's' : ''} retrieved
        {current.length > 0 && <span className="timeline-badge timeline-badge-current">{current.length} on view</span>}
        {upcoming.length > 0 && <span className="timeline-badge timeline-badge-upcoming">{upcoming.length} upcoming</span>}
        {past.length > 0 && <span className="timeline-badge timeline-badge-past">{past.length} past</span>}
      </div>
      <ExhibitionGroup label="On View Now" exhibitions={current} color={STATUS_COLORS.current} />
      <ExhibitionGroup label="Upcoming" exhibitions={upcoming} color={STATUS_COLORS.upcoming} />
      <ExhibitionGroup label="Past" exhibitions={past} color={STATUS_COLORS.past} />
      {unknown.length > 0 && (
        <ExhibitionGroup label="Date Unknown" exhibitions={unknown} color={STATUS_COLORS.unknown} />
      )}
    </>
  );
}

function TemporalBlock({ label, text, accent }: { label: string; text: string; accent: string }) {
  if (!text || text.includes('ANTHROPIC_API_KEY')) return null;
  return (
    <div className="temporal-block" style={{ borderLeftColor: accent }}>
      <div className="temporal-label" style={{ color: accent }}>{label}</div>
      <div className="temporal-text">{text}</div>
    </div>
  );
}

function CuratorialSection({ profile }: { profile: CuratorialProfile }) {
  const hasTemporalData = profile.pastTrends || profile.currentHighlights || profile.upcomingChoices;

  return (
    <>
      {profile.summary && <p className="profile-summary">"{profile.summary}"</p>}

      {hasTemporalData && (
        <div className="temporal-section">
          <TemporalBlock
            label="Past — What choices did they make?"
            text={profile.pastTrends}
            accent="#888"
          />
          <TemporalBlock
            label="Now — What is open today?"
            text={profile.currentHighlights}
            accent="#1a7a4a"
          />
          <TemporalBlock
            label="Next — Where are they heading?"
            text={profile.upcomingChoices}
            accent="#1a4a7a"
          />
          {profile.strategicTakeaway && (
            <div className="strategic-takeaway">
              <span className="strategic-label">Strategic read</span>
              <span className="strategic-text">{profile.strategicTakeaway}</span>
            </div>
          )}
        </div>
      )}

      <div className="profile-grid">
        <div className="profile-field">
          <span className="profile-field-label">Primary Mediums</span>
          <TagList items={profile.mediums} />
        </div>
        <div className="profile-field">
          <span className="profile-field-label">Movements & Styles</span>
          <TagList items={profile.movements} />
        </div>
        <div className="profile-field profile-field-full">
          <span className="profile-field-label">Recurring Themes</span>
          <TagList items={profile.themes} />
        </div>
        <div className="profile-field profile-field-full">
          <span className="profile-field-label">Programming Patterns</span>
          <span className="profile-field-value">{profile.programmingPatterns || '—'}</span>
        </div>
        {profile.notableStrengths && profile.notableStrengths.length > 0 && (
          <div className="profile-field profile-field-full">
            <span className="profile-field-label">Notable Strengths</span>
            <TagList items={profile.notableStrengths} />
          </div>
        )}
      </div>

      <div className="profile-field" style={{ marginBottom: 12 }}>
        <span className="profile-field-label">Artist Demographics</span>
      </div>
      <div className="artist-profile-grid">
        <div className="artist-profile-item">
          <span className="profile-field-label">Emerging vs. Established</span>
          <span className="profile-field-value">{profile.artistProfile?.emergingVsEstablished || '—'}</span>
        </div>
        <div className="artist-profile-item">
          <span className="profile-field-label">Nationality Patterns</span>
          <span className="profile-field-value">{profile.artistProfile?.nationalityPatterns || '—'}</span>
        </div>
        <div className="artist-profile-item">
          <span className="profile-field-label">Gender Representation</span>
          <span className="profile-field-value">{profile.artistProfile?.genderNotes || '—'}</span>
        </div>
        <div className="artist-profile-item">
          <span className="profile-field-label">Generational Focus</span>
          <span className="profile-field-value">{profile.artistProfile?.generationalFocus || '—'}</span>
        </div>
      </div>
    </>
  );
}

function GalleryCard({ result }: { result: GalleryResult }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline'>('profile');
  const scrapedDate = new Date(result.scrapedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return (
    <div className="gallery-card">
      <div className="gallery-card-header">
        <h2 className="gallery-card-name">{result.gallery.name}</h2>
        <div className="gallery-card-meta">
          <a href={result.gallery.url} target="_blank" rel="noopener noreferrer">
            {result.gallery.url.replace(/^https?:\/\//, '')}
          </a>
          <span style={{ marginLeft: 16 }}>Scraped {scrapedDate}</span>
        </div>
      </div>
      <div className="card-tabs">
        <button
          className={`card-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Curatorial Profile
        </button>
        <button
          className={`card-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Exhibition Timeline
        </button>
      </div>
      <div className="section-content">
        {activeTab === 'profile' ? (
          <CuratorialSection profile={result.profile} />
        ) : (
          <ExhibitionTimeline exhibitions={result.exhibitions} />
        )}
      </div>
    </div>
  );
}

// ─── Autocomplete Search ──────────────────────────────────────────────────────

function SearchBox({
  query,
  setQuery,
  galleries,
  loading,
  onSubmit,
}: {
  query: string;
  setQuery: (q: string) => void;
  galleries: Gallery[];
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim().length === 0
    ? galleries
    : galleries.filter((g) =>
        g.name.toLowerCase().includes(query.trim().toLowerCase())
      );

  const handleSelect = (name: string) => {
    setQuery(name);
    setShowDropdown(false);
    setFocusedIdx(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown') { setShowDropdown(true); setFocusedIdx(0); }
      return;
    }
    if (e.key === 'ArrowDown') {
      setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setFocusedIdx((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      handleSelect(filtered[focusedIdx].name);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <form onSubmit={onSubmit} style={{ position: 'relative' }}>
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setFocusedIdx(-1); }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a gallery name…"
          disabled={loading}
          autoFocus
          autoComplete="off"
        />
        <button type="submit" className="search-button" disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : 'Profile'}
        </button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <div className="autocomplete-dropdown" ref={dropdownRef}>
          {filtered.map((g, i) => (
            <div
              key={g.name}
              className={`autocomplete-item ${i === focusedIdx ? 'focused' : ''} ${g.tier === 'featured' ? 'featured' : ''}`}
              onMouseDown={() => handleSelect(g.name)}
              onMouseEnter={() => setFocusedIdx(i)}
            >
              <span className="autocomplete-name">{g.name}</span>
              {g.tier === 'featured' && <span className="autocomplete-badge">Featured</span>}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GalleryResult | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    fetchGalleryList()
      .then((list) => setGalleries(list.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep('Fetching exhibition data…');
    try {
      const t1 = setTimeout(() => setLoadingStep('Scraping gallery website…'), 2000);
      const t2 = setTimeout(() => setLoadingStep('Synthesizing curatorial profile with AI…'), 6000);
      const data = await fetchGalleryProfile(query.trim());
      clearTimeout(t1);
      clearTimeout(t2);
      setResult(data);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'An error occurred';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Chelsea Gallery Profiler</h1>
        <p className="app-subtitle">Live curatorial intelligence for contemporary galleries</p>
      </header>

      <main className="app-main">
        <SearchBox
          query={query}
          setQuery={setQuery}
          galleries={galleries}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <p className="gallery-hints">
          {galleries.length > 0 ? `${galleries.length} galleries indexed` : 'Loading galleries…'}
        </p>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <div className="loading-label">Profiling Gallery</div>
            <div className="loading-steps">{loadingStep}</div>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {result && !loading && <GalleryCard result={result} />}
      </main>

      <footer className="app-footer">
        Data scraped live — results reflect current gallery website content
      </footer>
    </div>
  );
}
