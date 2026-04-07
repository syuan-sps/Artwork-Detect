import React, { useState, FormEvent } from 'react';
import './App.css';
import { fetchGalleryProfile } from './api';
import { GalleryResult, Exhibition, CuratorialProfile } from './types';

const GALLERY_SUGGESTIONS = [
  'David Zwirner',
  'Paula Cooper Gallery',
  'Gagosian',
  'Hauser & Wirth',
  'Pace Gallery',
];

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

function ExhibitionTimeline({ exhibitions }: { exhibitions: Exhibition[] }) {
  if (!exhibitions || exhibitions.length === 0) {
    return (
      <div className="empty-state">
        No exhibition data could be scraped from this gallery's website.
      </div>
    );
  }

  return (
    <>
      <div className="exhibition-count-bar">
        {exhibitions.length} exhibition{exhibitions.length !== 1 ? 's' : ''} retrieved
      </div>
      <div className="exhibition-list">
        {exhibitions.map((ex, i) => (
          <div key={i} className="exhibition-item">
            <div>
              <div className="exhibition-title">{ex.title}</div>
              {ex.artists && (
                <div className="exhibition-artists">{ex.artists}</div>
              )}
            </div>
            <div className="exhibition-right">
              {ex.dates && <div className="exhibition-dates">{ex.dates}</div>}
              {ex.location && <div className="exhibition-location">{ex.location}</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CuratorialSection({ profile }: { profile: CuratorialProfile }) {
  return (
    <>
      {profile.summary && (
        <p className="profile-summary">"{profile.summary}"</p>
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

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GalleryResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep('Fetching exhibition data…');

    try {
      setTimeout(() => setLoadingStep('Scraping gallery website…'), 2000);
      setTimeout(() => setLoadingStep('Synthesizing curatorial profile with AI…'), 5000);
      const data = await fetchGalleryProfile(query.trim());
      setResult(data);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'An error occurred';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Chelsea Gallery Profiler</h1>
        <p className="app-subtitle">Live curatorial intelligence for contemporary galleries</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a gallery name…"
              disabled={loading}
              autoFocus
            />
            <button type="submit" className="search-button" disabled={loading || !query.trim()}>
              {loading ? 'Searching…' : 'Profile'}
            </button>
          </div>
        </form>

        <p className="gallery-hints">
          Try:{' '}
          {GALLERY_SUGGESTIONS.map((name, i) => (
            <React.Fragment key={name}>
              <span onClick={() => handleSuggestionClick(name)}>{name}</span>
              {i < GALLERY_SUGGESTIONS.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
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
