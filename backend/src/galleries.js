/**
 * Gallery registry — hardcoded URLs and scraper hints for the 5 target galleries.
 */
const GALLERIES = {
  'david zwirner': {
    name: 'David Zwirner',
    url: 'https://www.davidzwirner.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  'paula cooper': {
    name: 'Paula Cooper Gallery',
    url: 'https://www.paulacoopergallery.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  'paula cooper gallery': {
    name: 'Paula Cooper Gallery',
    url: 'https://www.paulacoopergallery.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  gagosian: {
    name: 'Gagosian',
    url: 'https://gagosian.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  'hauser & wirth': {
    name: 'Hauser & Wirth',
    url: 'https://www.hauserwirth.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  'hauser and wirth': {
    name: 'Hauser & Wirth',
    url: 'https://www.hauserwirth.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  hauserwirth: {
    name: 'Hauser & Wirth',
    url: 'https://www.hauserwirth.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  pace: {
    name: 'Pace Gallery',
    url: 'https://www.pacegallery.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
  'pace gallery': {
    name: 'Pace Gallery',
    url: 'https://www.pacegallery.com',
    exhibitionsPath: '/exhibitions',
    jsRendered: false,
  },
};

function findGallery(query) {
  const normalized = query.trim().toLowerCase();
  // Exact match
  if (GALLERIES[normalized]) return GALLERIES[normalized];
  // Partial match
  for (const [key, gallery] of Object.entries(GALLERIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return gallery;
    }
  }
  return null;
}

module.exports = { GALLERIES, findGallery };
