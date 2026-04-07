/**
 * Gallery registry — 55 Chelsea / New York galleries with hardcoded URLs.
 * The 5 original "featured" galleries have hand-tuned scrapers.
 * The remaining 50 use the universal Puppeteer scraper.
 */

const GALLERIES = {
  // ─── Tier 1: Featured galleries with custom scrapers ─────────────────────
  'david zwirner': {
    name: 'David Zwirner',
    url: 'https://www.davidzwirner.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  'paula cooper': {
    name: 'Paula Cooper Gallery',
    url: 'https://www.paulacoopergallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  'paula cooper gallery': {
    name: 'Paula Cooper Gallery',
    url: 'https://www.paulacoopergallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  gagosian: {
    name: 'Gagosian',
    url: 'https://gagosian.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  'hauser & wirth': {
    name: 'Hauser & Wirth',
    url: 'https://www.hauserwirth.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  'hauser and wirth': {
    name: 'Hauser & Wirth',
    url: 'https://www.hauserwirth.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  hauserwirth: {
    name: 'Hauser & Wirth',
    url: 'https://www.hauserwirth.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  pace: {
    name: 'Pace Gallery',
    url: 'https://www.pacegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  'pace gallery': {
    name: 'Pace Gallery',
    url: 'https://www.pacegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },

  // ─── Tier 2: Major Chelsea galleries ─────────────────────────────────────
  '303 gallery': {
    name: '303 Gallery',
    url: 'https://www.303gallery.com',
    exhibitionsPath: '/gallery-exhibitions',
    tier: 'standard',
  },
  '303': {
    name: '303 Gallery',
    url: 'https://www.303gallery.com',
    exhibitionsPath: '/gallery-exhibitions',
    tier: 'standard',
  },
  'gladstone gallery': {
    name: 'Gladstone Gallery',
    url: 'https://www.gladstonegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  gladstone: {
    name: 'Gladstone Gallery',
    url: 'https://www.gladstonegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'luhring augustine': {
    name: 'Luhring Augustine',
    url: 'https://www.luhringaugustine.com',
    exhibitionsPath: '/exhibitions/past',
    tier: 'standard',
  },
  'lehmann maupin': {
    name: 'Lehmann Maupin',
    url: 'https://www.lehmannmaupin.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'andrew kreps': {
    name: 'Andrew Kreps Gallery',
    url: 'https://www.andrewkreps.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'andrew kreps gallery': {
    name: 'Andrew Kreps Gallery',
    url: 'https://www.andrewkreps.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'greene naftali': {
    name: 'Greene Naftali',
    url: 'https://www.greenenaftaligallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'cheim & read': {
    name: 'Cheim & Read',
    url: 'https://www.cheimread.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'cheim and read': {
    name: 'Cheim & Read',
    url: 'https://www.cheimread.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'matthew marks': {
    name: 'Matthew Marks Gallery',
    url: 'https://www.matthewmarks.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'matthew marks gallery': {
    name: 'Matthew Marks Gallery',
    url: 'https://www.matthewmarks.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'marian goodman': {
    name: 'Marian Goodman Gallery',
    url: 'https://www.mariangoodman.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'marian goodman gallery': {
    name: 'Marian Goodman Gallery',
    url: 'https://www.mariangoodman.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'jack shainman': {
    name: 'Jack Shainman Gallery',
    url: 'https://www.jackshainman.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'jack shainman gallery': {
    name: 'Jack Shainman Gallery',
    url: 'https://www.jackshainman.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'anton kern': {
    name: 'Anton Kern Gallery',
    url: 'https://www.antonkerngallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'sean kelly': {
    name: 'Sean Kelly Gallery',
    url: 'https://www.skny.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'sean kelly gallery': {
    name: 'Sean Kelly Gallery',
    url: 'https://www.skny.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'james cohan': {
    name: 'James Cohan Gallery',
    url: 'https://www.jamescohan.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'james cohan gallery': {
    name: 'James Cohan Gallery',
    url: 'https://www.jamescohan.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'peter blum': {
    name: 'Peter Blum Gallery',
    url: 'https://www.peterblumgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'sikkema jenkins': {
    name: 'Sikkema Jenkins & Co.',
    url: 'https://www.sikkemajenkinsco.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'galerie lelong': {
    name: 'Galerie Lelong & Co.',
    url: 'https://www.galerielelong.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'lelong': {
    name: 'Galerie Lelong & Co.',
    url: 'https://www.galerielelong.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'friedman benda': {
    name: 'Friedman Benda',
    url: 'https://www.friedmanbenda.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'albertz benda': {
    name: 'Albertz Benda',
    url: 'https://www.albertzbenda.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'berry campbell': {
    name: 'Berry Campbell',
    url: 'https://www.berrycampbell.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'nicola vassell': {
    name: 'Nicola Vassell Gallery',
    url: 'https://www.nicolavassell.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'salon 94': {
    name: 'Salon 94',
    url: 'https://www.salon94.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'petzel': {
    name: 'Petzel Gallery',
    url: 'https://www.petzel.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'petzel gallery': {
    name: 'Petzel Gallery',
    url: 'https://www.petzel.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'tanya bonakdar': {
    name: 'Tanya Bonakdar Gallery',
    url: 'https://www.tanyabonakdargallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'tanya bonakdar gallery': {
    name: 'Tanya Bonakdar Gallery',
    url: 'https://www.tanyabonakdargallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'barbara gladstone': {
    name: 'Gladstone Gallery',
    url: 'https://www.gladstonegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'mary boone': {
    name: 'Mary Boone Gallery',
    url: 'https://www.maryboonegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'casey kaplan': {
    name: 'Casey Kaplan Gallery',
    url: 'https://www.caseykaplangallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'casey kaplan gallery': {
    name: 'Casey Kaplan Gallery',
    url: 'https://www.caseykaplangallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'ota fine arts': {
    name: 'Ota Fine Arts',
    url: 'https://www.otafinearts.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'marianne boesky': {
    name: 'Marianne Boesky Gallery',
    url: 'https://www.marianneboeskygallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'marianne boesky gallery': {
    name: 'Marianne Boesky Gallery',
    url: 'https://www.marianneboeskygallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'mitchell-innes & nash': {
    name: 'Mitchell-Innes & Nash',
    url: 'https://www.miandn.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'mitchell innes nash': {
    name: 'Mitchell-Innes & Nash',
    url: 'https://www.miandn.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'zwirner & wirth': {
    name: 'David Zwirner',
    url: 'https://www.davidzwirner.com',
    exhibitionsPath: '/exhibitions',
    tier: 'featured',
  },
  'pippy houldsworth': {
    name: 'Pippy Houldsworth Gallery',
    url: 'https://www.houldsworth.co.uk',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'ryan lee': {
    name: 'Ryan Lee Gallery',
    url: 'https://www.ryanleegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'ryan lee gallery': {
    name: 'Ryan Lee Gallery',
    url: 'https://www.ryanleegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'dckt contemporary': {
    name: 'DCKT Contemporary',
    url: 'https://www.dcktcontemporary.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'hales gallery': {
    name: 'Hales Gallery',
    url: 'https://www.halesgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'hales': {
    name: 'Hales Gallery',
    url: 'https://www.halesgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'kaufmann repetto': {
    name: 'Kaufmann Repetto',
    url: 'https://www.kaufmannrepetto.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'nara roesler': {
    name: 'Nara Roesler Gallery',
    url: 'https://nararoesler.art',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'cynthia reeves': {
    name: 'Cynthia Reeves Gallery',
    url: 'https://www.cynthiareeves.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'black cube': {
    name: 'Black Cube',
    url: 'https://www.blackcube.art',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'canada gallery': {
    name: 'CANADA',
    url: 'https://www.canadanewyork.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  canada: {
    name: 'CANADA',
    url: 'https://www.canadanewyork.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'half gallery': {
    name: 'Half Gallery',
    url: 'https://www.halfgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'half': {
    name: 'Half Gallery',
    url: 'https://www.halfgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'essex street': {
    name: 'Essex Street',
    url: 'https://www.essexstreet.biz',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'ramiken crucible': {
    name: 'Ramiken',
    url: 'https://www.ramiken.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  ramiken: {
    name: 'Ramiken',
    url: 'https://www.ramiken.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'tiong ang': {
    name: 'Tiong Ang Gallery',
    url: 'https://www.tiongangarts.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'm+b gallery': {
    name: 'M+B Gallery',
    url: 'https://www.mbart.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'p·p·o·w': {
    name: 'P·P·O·W',
    url: 'https://www.ppowgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  ppow: {
    name: 'P·P·O·W',
    url: 'https://www.ppowgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'mulherin': {
    name: 'Mulherin Gallery',
    url: 'https://www.mulheringallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'thomas erben': {
    name: 'Thomas Erben Gallery',
    url: 'https://www.thomaserben.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'edward thorp': {
    name: 'Edward Thorp Gallery',
    url: 'https://www.edwardthorpgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'sundaram tagore': {
    name: 'Sundaram Tagore Gallery',
    url: 'https://www.sundaramtagore.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'nancy hoffman': {
    name: 'Nancy Hoffman Gallery',
    url: 'https://www.nancyhoffmangallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'nancy hoffman gallery': {
    name: 'Nancy Hoffman Gallery',
    url: 'https://www.nancyhoffmangallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'bryce wolkowitz': {
    name: 'Bryce Wolkowitz Gallery',
    url: 'https://www.brycewolkowitz.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'yancey richardson': {
    name: 'Yancey Richardson Gallery',
    url: 'https://www.yanceyrichardson.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'yancey richardson gallery': {
    name: 'Yancey Richardson Gallery',
    url: 'https://www.yanceyrichardson.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'klowden mann': {
    name: 'Klowden Mann',
    url: 'https://www.klowdenmann.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'bill brady': {
    name: 'Bill Brady Gallery',
    url: 'https://www.billbradygallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'robischon': {
    name: 'Robischon Gallery',
    url: 'https://www.robischongallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'luxe gallery': {
    name: 'Luxe Gallery',
    url: 'https://www.luxegallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'mike weiss': {
    name: 'Mike Weiss Gallery',
    url: 'https://www.mikeweissgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'clamp art': {
    name: 'ClampArt',
    url: 'https://www.clampart.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  clampart: {
    name: 'ClampArt',
    url: 'https://www.clampart.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'invisible exports': {
    name: 'Invisible-Exports',
    url: 'https://www.invisible-exports.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'bureau': {
    name: 'Bureau',
    url: 'https://www.bureaunyc.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'bortolami': {
    name: 'Bortolami Gallery',
    url: 'https://www.bortolamigallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'bortolami gallery': {
    name: 'Bortolami Gallery',
    url: 'https://www.bortolamigallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'marlborough gallery': {
    name: 'Marlborough Gallery',
    url: 'https://www.marlboroughgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  marlborough: {
    name: 'Marlborough Gallery',
    url: 'https://www.marlboroughgallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'zürcher gallery': {
    name: 'Zürcher Gallery',
    url: 'https://www.zurcher-gallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'zurcher': {
    name: 'Zürcher Gallery',
    url: 'https://www.zurcher-gallery.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'flag art foundation': {
    name: 'FLAG Art Foundation',
    url: 'https://www.flagartfoundation.org',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'michael rosenfeld': {
    name: 'Michael Rosenfeld Gallery',
    url: 'https://www.michaelrosenfeldart.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'michael rosenfeld gallery': {
    name: 'Michael Rosenfeld Gallery',
    url: 'https://www.michaelrosenfeldart.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'dckt': {
    name: 'DCKT Contemporary',
    url: 'https://www.dcktcontemporary.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'kavi gupta': {
    name: 'Kavi Gupta Gallery',
    url: 'https://kavigupta.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
  'kavi gupta gallery': {
    name: 'Kavi Gupta Gallery',
    url: 'https://kavigupta.com',
    exhibitionsPath: '/exhibitions',
    tier: 'standard',
  },
};

/**
 * Return a canonical gallery config from a user query string.
 * Tries exact match, then partial match.
 */
function findGallery(query) {
  const normalized = query.trim().toLowerCase();

  if (GALLERIES[normalized]) return GALLERIES[normalized];

  // Partial containment match
  for (const [key, gallery] of Object.entries(GALLERIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return gallery;
    }
  }
  return null;
}

/**
 * Return the deduplicated public gallery list (one entry per unique name).
 */
function listGalleries() {
  const seen = new Set();
  return Object.values(GALLERIES).filter((g) => {
    if (seen.has(g.name)) return false;
    seen.add(g.name);
    return true;
  });
}

module.exports = { GALLERIES, findGallery, listGalleries };
