require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { findGallery, listGalleries } = require('./galleries');
const { scrapeGallery } = require('./scraper');
const { synthesizeProfile } = require('./synthesizer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/galleries', (req, res) => {
  const list = listGalleries().map((g) => ({
    name: g.name,
    url: g.url,
    tier: g.tier || 'standard',
  }));
  res.json(list);
});

app.post('/api/profile', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query is required' });
  }

  const gallery = findGallery(query);
  if (!gallery) {
    return res.status(404).json({
      error: `Gallery not found. Supported galleries: David Zwirner, Paula Cooper Gallery, Gagosian, Hauser & Wirth, Pace Gallery`,
    });
  }

  try {
    console.log(`[${new Date().toISOString()}] Scraping ${gallery.name}...`);
    const exhibitions = await scrapeGallery(gallery);
    console.log(`[${new Date().toISOString()}] Got ${exhibitions.length} exhibitions, synthesizing...`);

    const profile = await synthesizeProfile(gallery.name, exhibitions);

    res.json({
      gallery: {
        name: gallery.name,
        url: gallery.url,
      },
      exhibitions,
      profile,
      scrapedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`Profile error for ${gallery.name}:`, err.message);
    res.status(500).json({ error: `Failed to profile ${gallery.name}: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Chelsea Gallery Profiler backend running on port ${PORT}`);
});
