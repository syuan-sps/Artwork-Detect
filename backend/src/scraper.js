const puppeteer = require('puppeteer');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function launchBrowser() {
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Given combined "ArtistNameExhibition Title" text (adjacent DOM nodes merged without separator),
 * use the URL slug to find the correct artist/title split.
 *
 * The Gagosian DOM has e.g.:
 *   text: "Jasper JohnsBetween the Clock and the Bed"
 *   slug: "jasper-johns-between-the-clock-and-the-bed"
 *
 * Strategy: find CamelCase boundaries in the text (uppercase after lowercase, no space),
 * check if the artist prefix normalizes to the start of the slug AND the title prefix
 * matches the remainder.
 */
function splitArtistTitle(combined, slug) {
  if (!combined || !slug) return { artist: '', title: combined || '' };

  const slugNorm = normalize(slug);

  // Find CamelCase split points
  const splitPoints = [];
  for (let i = 1; i < combined.length; i++) {
    if (
      combined[i] >= 'A' &&
      combined[i] <= 'Z' &&
      combined[i - 1] !== ' ' &&
      combined[i - 1] >= 'a' &&
      combined[i - 1] <= 'z'
    ) {
      splitPoints.push(i);
    }
  }

  // For each split, verify artist norm matches slug start AND title norm matches remainder
  for (const sp of splitPoints) {
    const artist = combined.slice(0, sp).trim();
    const title = combined.slice(sp).trim();
    if (!artist || !title) continue;
    const artistNorm = normalize(artist);
    if (!slugNorm.startsWith(artistNorm) || artistNorm.length < 3) continue;
    const remainingSlug = slugNorm.slice(artistNorm.length);
    const titleNorm = normalize(title);
    // Require first 3 chars of title to match remainder of slug
    if (remainingSlug.length > 0 && titleNorm.slice(0, 3) === remainingSlug.slice(0, 3)) {
      return { artist, title };
    }
  }

  return { artist: '', title: combined };
}

/**
 * Parse a date+location string like "March 26–May 2, 2026Park & 75, New York"
 * or "October 19, 2025–April 18, 2026Le Bourget"
 */
function parseDateLocation(text) {
  if (!text) return { dates: '', location: '' };
  // Match date range including optional year at start
  const dateRegex =
    /([A-Z][a-z]+ \d{1,2}(?:,?\s*\d{4})?[–\-—]+[A-Z][a-z]+ \d{1,2},?\s*\d{4})/;
  const dateMatch = text.match(dateRegex);
  const dates = dateMatch ? dateMatch[1] : '';
  const location = text.replace(dates, '').trim();
  return { dates, location };
}

// ─── David Zwirner ───────────────────────────────────────────────────────────

async function scrapeDavidZwirner() {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.goto('https://www.davidzwirner.com/exhibitions', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const raw = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('a[href*="/exhibitions/"]').forEach((el) => {
        const href = el.href;
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        if (
          !href.match(/\/exhibitions\/?$/) &&
          !text.match(/^(Exhibitions|Artists|Archive|Filter|Past|Current|Upcoming|Learn More|View All)$/i) &&
          text.length > 10 &&
          text.length < 600
        ) {
          items.push({ href, text });
        }
      });
      return [...new Map(items.map((i) => [i.href, i])).values()];
    });

    for (const item of raw) {
      const raw_text = item.text;
      const slug = item.href.split('/').pop() || '';

      // Format: "ArtistTitleLocation(Now Open|Coming Soon|Opening DATE): DateLearn More"
      // 1. Strip "Learn More" at end
      const stripped = raw_text.replace(/Learn More\s*$/i, '').trim();

      // 2. Extract date range (comes after status label like "Now Open:")
      const dateMatch = stripped.match(
        /([A-Z][a-z]+ \d{1,2}[—–\-][A-Z]?[a-z]* ?\d{1,2},?\s*\d{4})/
      );
      const dates = dateMatch ? dateMatch[1] : '';

      // 3. Remove everything from "Now Open:" / "Coming Soon:" / "Opening DATE:" onwards
      const statusIdx = stripped.search(/(Now Open|Coming Soon|Opening [A-Z])[:\s]/i);
      const textBlock = statusIdx > 0 ? stripped.slice(0, statusIdx).trim() : stripped.replace(dates, '').trim();

      // 4. Extract location — known cities / address patterns at end of textBlock
      const locationMatch = textBlock.match(
        /(New York(?:[:\s]*(?:19th|20th|Walker|69th|21st)[^\w]*Street)?|Los Angeles|London|Paris|Hong Kong|Berlin|Seoul)\s*$/i
      );
      const location = locationMatch ? locationMatch[1].replace(/\s+/g, ' ').trim() : '';
      const titleBlock = textBlock.replace(locationMatch ? locationMatch[0] : '', '').trim();

      // 5. Split artist from title using slug
      const { artist, title } = splitArtistTitle(titleBlock, slug);

      exhibitions.push({ title: title || titleBlock, artists: artist, dates, location });
    }
  } catch (err) {
    console.error('David Zwirner scrape error:', err.message);
  } finally {
    await browser.close();
  }
  return exhibitions;
}

// ─── Gagosian ────────────────────────────────────────────────────────────────

async function scrapeGagosian() {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.goto('https://gagosian.com/exhibitions', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const raw = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('[class*="col-span-"]').forEach((el) => {
        const anchor = el.querySelector('a[href*="/exhibitions/"]');
        if (!anchor) return;
        const href = anchor.href;
        const typeElems = [
          ...el.querySelectorAll(
            '[class*="type-m"], [class*="type-mc"], [class*="type-gh"], [class*="type-america"]'
          ),
        ];
        const texts = typeElems
          .map((t) => t.textContent.trim().replace(/\s+/g, ' '))
          .filter(Boolean);
        if (texts.length > 0 && !texts.join(' ').includes('Stay up-to-date')) {
          items.push({ href, texts });
        }
      });
      return [...new Map(items.map((i) => [i.href, i])).values()];
    });

    for (const item of raw) {
      const { href, texts } = item;
      const slug = href.split('/').filter(Boolean).pop() || '';

      // texts[0] might be "Extended through..." banner; real data is last two segments
      const filtered = texts.filter((t) => !t.match(/^Extended through/i));

      // First segment: combined artist+title
      const artistTitle = filtered[0] || '';
      // Second segment: date+location
      const dateLoc = filtered[1] || '';

      const { artist, title } = splitArtistTitle(artistTitle, slug);
      const { dates, location } = parseDateLocation(dateLoc);

      exhibitions.push({
        title: title || artistTitle,
        artists: artist,
        dates,
        location,
      });
    }
  } catch (err) {
    console.error('Gagosian scrape error:', err.message);
  } finally {
    await browser.close();
  }
  return exhibitions;
}

// ─── Paula Cooper Gallery ─────────────────────────────────────────────────────

async function scrapePaulaCooper() {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);

    const urls = [
      'https://www.paulacoopergallery.com/exhibitions',
      'https://www.paulacoopergallery.com/exhibitions/past/all/2026-2023',
      'https://www.paulacoopergallery.com/exhibitions/past/all/2022-2019',
    ];

    const seenHrefs = new Set();

    for (const url of urls) {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const raw = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('a[href*="/exhibitions/"]').forEach((el) => {
          const href = el.href;
          const text = el.textContent.trim().replace(/\s+/g, ' ');
          if (
            !href.match(/\/past\/|\/exhibitions\/?$|museum-exhibitions/) &&
            text.length > 10 &&
            text.length < 600
          ) {
            items.push({ href, text });
          }
        });
        return [...new Map(items.map((i) => [i.href, i])).values()];
      });

      for (const item of raw) {
        if (seenHrefs.has(item.href)) continue;
        seenHrefs.add(item.href);

        const text = item.text;
        const slug = item.href.split('/').pop() || '';

        // Date range
        const dateMatch = text.match(
          /([A-Z][a-z]+ \d{1,2}(?:,?\s*\d{4})?[\s–\-—]+[A-Z][a-z]+ \d{1,2},?\s*\d{4})/
        );
        const dates = dateMatch ? dateMatch[0] : '';
        const withoutDates = text.replace(dates, '').trim();

        // Street address
        const locationMatch = withoutDates.match(
          /(\d+\s+(?:West|East|North|South)\s+[\w\s]+(?:Street|Avenue|Ave|St))/i
        );
        const location = locationMatch ? locationMatch[1].trim() : '';
        const withoutLocation = withoutDates.replace(location, '').trim();

        const { artist, title } = splitArtistTitle(withoutLocation, slug);

        exhibitions.push({
          title: title || withoutLocation,
          artists: artist,
          dates,
          location,
        });
      }

      if (exhibitions.length >= 40) break;
    }
  } catch (err) {
    console.error('Paula Cooper scrape error:', err.message);
  } finally {
    await browser.close();
  }
  return exhibitions;
}

// ─── Pace Gallery ─────────────────────────────────────────────────────────────

async function scrapePaceGallery() {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.goto('https://www.pacegallery.com/exhibitions', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const raw = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('a[href*="/exhibitions/"]').forEach((el) => {
        const href = el.href;
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        if (
          !href.match(/\/exhibitions\/?$|\/status\//) &&
          text.length > 10 &&
          text.length < 600
        ) {
          items.push({ href, text });
        }
      });
      return [...new Map(items.map((i) => [i.href, i])).values()];
    });

    for (const item of raw) {
      const text = item.text;
      const slug = item.href.split('/').filter(Boolean).pop() || '';

      // Status: "On View", "Upcoming", "Past"
      const statusMatch = text.match(/\s+(On View|Upcoming|Past)\s+/i);
      const artistName = statusMatch ? text.slice(0, statusMatch.index).trim() : '';
      const afterStatus = statusMatch
        ? text.slice((statusMatch.index || 0) + statusMatch[0].length)
        : text;

      // Date range (short month abbrevs or full)
      const dateMatch = afterStatus.match(
        /([A-Z][a-z]{1,8}\.?\s+\d{1,2}(?:,\s*\d{4})?[\s–\-—]+[A-Z][a-z]{1,8}\.?\s+\d{1,2},?\s*\d{4})/
      );
      const dates = dateMatch ? dateMatch[0] : '';
      const withoutDates = afterStatus.replace(dates, '').trim();

      // Location at the end
      const locationMatch = withoutDates.match(
        /\s+(New York|Los Angeles|London|Paris|Hong Kong|Geneva|Seoul|Palm Beach|[A-Z][a-z]+(?: [A-Z][a-z]+)?)\s*$/
      );
      const location = locationMatch ? locationMatch[1].trim() : '';
      const titlePart = withoutDates.replace(locationMatch ? locationMatch[0] : '', '').trim();

      exhibitions.push({
        title: titlePart || slug.replace(/-/g, ' '),
        artists: artistName,
        dates,
        location,
      });
    }
  } catch (err) {
    console.error('Pace Gallery scrape error:', err.message);
  } finally {
    await browser.close();
  }
  return exhibitions;
}

// ─── Hauser & Wirth ────────────────────────────────────────────────────────────

async function scrapeHauserWirth() {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Upgrade-Insecure-Requests': '1',
    });

    // Try the exhibitions page
    await page.goto('https://www.hauserwirth.com/exhibitions', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const html = await page.content();
    const isBlocked =
      html.includes('security-checkpoint') ||
      html.includes('vercel') ||
      html.length < 10000;

    if (!isBlocked) {
      const raw = await page.evaluate(() => {
        const items = [];
        document
          .querySelectorAll('a[href*="/exhibitions/"], a[href*="/shows/"]')
          .forEach((el) => {
            const href = el.href;
            const text = el.textContent.trim().replace(/\s+/g, ' ');
            if (text.length > 10 && text.length < 500) {
              items.push({ href, text });
            }
          });
        return [...new Map(items.map((i) => [i.href, i])).values()].slice(0, 30);
      });

      for (const item of raw) {
        const slug = item.href.split('/').filter(Boolean).pop() || '';
        const dateMatch = item.text.match(
          /([A-Z][a-z]+ \d{1,2}(?:,?\s*\d{4})?[\s–\-—]+[A-Z][a-z]+ \d{1,2},?\s*\d{4})/
        );
        const dates = dateMatch ? dateMatch[0] : '';
        const block = item.text.replace(dates, '').trim();
        const { artist, title } = splitArtistTitle(block, slug);
        exhibitions.push({ title: title || block, artists: artist, dates, location: '' });
      }
    } else {
      console.log('Hauser & Wirth: protected by bot detection (HTTP 429 / Vercel checkpoint)');
      // Return a single informational entry so the AI can still generate a profile note
      exhibitions.push({
        title: '[Live scraping blocked by gallery website bot protection]',
        artists: '',
        dates: '',
        location: 'Hauser & Wirth operates galleries in New York, Los Angeles, London, Zürich, Somerset, St. Moritz, Menorca, Monaco, Hong Kong, and Los Angeles',
      });
    }
  } catch (err) {
    console.error('Hauser & Wirth scrape error:', err.message);
  } finally {
    await browser.close();
  }
  return exhibitions;
}

// ─── Universal fallback ───────────────────────────────────────────────────────

async function scrapeUniversal(galleryConfig) {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    const url = `${galleryConfig.url}${galleryConfig.exhibitionsPath}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const raw = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('a[href*="exhibition"], a[href*="show"]').forEach((el) => {
        const href = el.href;
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        if (text.length > 10 && text.length < 500) {
          items.push({ href, text });
        }
      });
      return [...new Map(items.map((i) => [i.href, i])).values()].slice(0, 30);
    });

    for (const item of raw) {
      const dateMatch = item.text.match(
        /([A-Z][a-z]+ \d{1,2}(?:,?\s*\d{4})?[\s–\-—]+[A-Z][a-z]+ \d{1,2},?\s*\d{4})/
      );
      const dates = dateMatch ? dateMatch[0] : '';
      const title = item.text.replace(dates, '').trim();
      if (title.length > 3) {
        exhibitions.push({ title, artists: '', dates, location: '' });
      }
    }
  } catch (err) {
    console.error(`Universal scrape error for ${galleryConfig.name}:`, err.message);
  } finally {
    await browser.close();
  }
  return exhibitions;
}

// ─── Main entry ───────────────────────────────────────────────────────────────

async function scrapeGallery(galleryConfig) {
  const name = galleryConfig.name.toLowerCase();
  let exhibitions = [];

  if (name.includes('zwirner')) {
    exhibitions = await scrapeDavidZwirner();
  } else if (name.includes('paula cooper')) {
    exhibitions = await scrapePaulaCooper();
  } else if (name.includes('gagosian')) {
    exhibitions = await scrapeGagosian();
  } else if (name.includes('hauser')) {
    exhibitions = await scrapeHauserWirth();
  } else if (name.includes('pace')) {
    exhibitions = await scrapePaceGallery();
  }

  if (exhibitions.length === 0) {
    exhibitions = await scrapeUniversal(galleryConfig);
  }

  // Deduplicate and clean
  const seen = new Set();
  return exhibitions.filter((ex) => {
    const key = (ex.title || '').trim().toLowerCase();
    if (!key || key.length < 3 || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { scrapeGallery };
