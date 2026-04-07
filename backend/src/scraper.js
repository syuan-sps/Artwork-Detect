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
 * Given combined "ArtistTitleText" (DOM nodes merged without separator),
 * use the URL slug to find the correct artist / title split.
 *
 * Scoring heuristic: among all valid slug-word-boundary splits, prefer:
 *   1. Splits where the title starts with uppercase (clear camelCase join)
 *   2. Splits where the artist ends at a space (clean word boundary)
 *   3. The longest matching split (most specific artist identification)
 */
function splitArtistTitle(combined, slug) {
  if (!combined || !slug) return { artist: '', title: combined || '' };

  const slugNorm = normalize(slug);

  // normToRaw: for each normalized char index, its raw text position
  const normToRaw = [];
  for (let i = 0; i < combined.length; i++) {
    if (/[a-z0-9]/i.test(combined[i])) normToRaw.push(i);
  }

  // Slug word boundaries (cumulative normalized lengths, including full slug end)
  const slugSegments = slug.split('-');
  const boundaries = [];
  let cumLen = 0;
  for (const seg of slugSegments) {
    cumLen += normalize(seg).length;
    boundaries.push(cumLen);
  }

  const validSplits = [];

  for (const boundary of boundaries) {
    if (boundary === 0 || boundary > normToRaw.length) continue;

    const rawEnd = normToRaw[boundary - 1];
    if (normalize(combined.slice(0, rawEnd + 1)) !== slugNorm.slice(0, boundary)) continue;

    const splitPos = rawEnd + 1;
    const artist = combined.slice(0, splitPos).trim();
    const title = combined.slice(splitPos).trim();
    if (!artist || !title) continue;

    // Verify title starts with what the slug says comes next
    const remainSlug = slugNorm.slice(boundary);
    if (remainSlug.length >= 3) {
      // Normalize title, but also handle non-ASCII by stripping accents
      const titleNorm = normalize(title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      const chk = Math.min(4, remainSlug.length);
      if (titleNorm.slice(0, chk) !== remainSlug.slice(0, chk)) continue;
    }

    const titleFirstChar = combined[splitPos] || '';
    const artistLastChar = combined[splitPos - 1] || '';
    // Score: title starting uppercase + artist ending at space = best split
    const score =
      (titleFirstChar >= 'A' && titleFirstChar <= 'Z' ? 2 : 0) +
      (artistLastChar === ' ' ? 1 : 0);

    validSplits.push({ artist, title, boundary, score });
  }

  if (validSplits.length === 0) return { artist: '', title: combined };

  // Sort: highest score first, then longest boundary (most artist words identified)
  validSplits.sort((a, b) => b.score - a.score || b.boundary - a.boundary);
  return { artist: validSplits[0].artist, title: validSplits[0].title };
}

/**
 * For David Zwirner links the text format is:
 *   "ArtistTitleLocation(Now Open|Coming Soon|Opening DATE): DateLearn More"
 * This function strips all trailing noise and extracts artist, title, dates, location.
 */
function parseDavidZwirnerLink(rawText, slug) {
  // Strip "Learn More" at end
  let text = rawText.replace(/Learn More\s*$/i, '').trim();

  // Strip status + date suffix: "Now Open: DATE", "Coming Soon: DATE", "Opening DATE:"
  // Keep everything before the status marker
  const statusIdx = text.search(/(Now Open|Coming Soon|Opening [A-Z][a-z])[:\s]/i);
  let beforeStatus = statusIdx > 0 ? text.slice(0, statusIdx).trim() : text;

  // Extract date range from the full text (it may appear after status)
  const dateMatch = text.match(/([A-Z][a-z]+ \d{1,2}[—–\-][A-Z]?[a-z]* ?\d{1,2},?\s*\d{4})/);
  const dates = dateMatch ? dateMatch[1] : '';

  // Location at end of beforeStatus — known city/address patterns
  const locationMatch = beforeStatus.match(
    /(New York(?:[:\s]*(?:19th|20th|Walker|69th|21st|25th)[^\w]*Street)?|Los Angeles|London|Paris|Hong Kong|Berlin|Seoul|Brussels)\s*$/i
  );
  const location = locationMatch ? locationMatch[1].replace(/\s+/g, ' ').trim() : '';
  const titleBlock = beforeStatus.replace(locationMatch ? locationMatch[0] : '', '').trim();

  const { artist, title } = splitArtistTitle(titleBlock, slug);
  return { artist, title: title || titleBlock, dates, location };
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
      const slug = item.href.split('/').pop() || '';
      const { artist, title, dates, location } = parseDavidZwirnerLink(item.text, slug);
      if (title) exhibitions.push({ title, artists: artist, dates, location });
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

        // Street address — remove so it doesn't pollute the title
        const locationMatch = withoutDates.match(
          /(\d+\s+(?:West|East|North|South)\s+[\w\s]+(?:Street|Avenue|Ave|St)|(?:534|521|529|314)\s+(?:West|East)[\s\w]+|Lever House[^,]*)/i
        );
        const location = locationMatch ? locationMatch[1].trim() : '';
        const withoutLocation = withoutDates.replace(locationMatch ? locationMatch[0] : '', '').trim();

        // Paula Cooper slugs are usually just artist-name (e.g. "ralph-lemon", "sol-lewitt5")
        // Try slug-based split; if the entire text normalizes to the artist slug, treat as artist-only show
        const slugBase = slug.replace(/\d+$/, ''); // strip trailing version numbers
        const { artist, title } = splitArtistTitle(withoutLocation, slugBase);

        // If artist captured and title is left, great. Otherwise: detect if text = "ArtistTitle"
        // by checking if the slug matches only the artist portion (artist-only shows have no title)
        let finalArtist = artist;
        let finalTitle = title || withoutLocation;

        // Extra check: if title looks like it's just the exhibition subtitle (artist name = whole slug)
        const fullNorm = normalize(withoutLocation);
        const slugNorm = normalize(slugBase);
        if (!artist && fullNorm.startsWith(slugNorm) && slugNorm.length >= 4) {
          // The slug covers only part of the text → remaining is the exhibition title
          const artistPartLen = slugNorm.length;
          // Reconstruct approximate character count
          let charCount = 0, idx = 0;
          for (const ch of withoutLocation) {
            if (/[a-z0-9]/i.test(ch)) charCount++;
            idx++;
            if (charCount >= artistPartLen) break;
          }
          finalArtist = withoutLocation.slice(0, idx).trim();
          finalTitle = withoutLocation.slice(idx).trim() || finalArtist;
          if (!withoutLocation.slice(idx).trim()) finalArtist = '';
        }

        exhibitions.push({
          title: finalTitle,
          artists: finalArtist,
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

      // Format: "Artist Name On View Exhibition Title Date Location"
      // Status badge is always present: "On View", "Upcoming", "Past"
      const statusMatch = text.match(/\s+(On View|Upcoming|Past)\s+/i);
      const artistName = statusMatch ? text.slice(0, statusMatch.index).trim() : '';
      const afterStatus = statusMatch
        ? text.slice((statusMatch.index || 0) + statusMatch[0].length)
        : text;

      // Date range — short or full month names
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
      let titlePart = withoutDates.replace(locationMatch ? locationMatch[0] : '', '').trim();

      // If title is suspiciously short (1-2 words), reconstruct from slug
      // e.g. "David Byrne Stairwell Drawings" slug vs text with only "New" as title
      if (titlePart.split(' ').length <= 2 && slug.includes('-')) {
        const slugWords = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
        const artistNormWords = artistName.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
        // Drop the artist words from the slug
        let slugArtistLen = 0;
        for (const aw of artistNormWords) {
          if (slugWords[slugArtistLen]?.toLowerCase() === aw) slugArtistLen++;
        }
        const titleFromSlug = slugWords.slice(slugArtistLen).join(' ');
        if (titleFromSlug && titleFromSlug.length > titlePart.length) {
          titlePart = titleFromSlug;
        }
      }

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

// ─── Universal scraper (works for ~90% of gallery sites) ─────────────────────

/**
 * Strategy:
 * 1. Try /exhibitions path, then /gallery-exhibitions, /shows, /program
 * 2. Collect all <a> tags with href containing "exhibition" or "show"
 * 3. Filter out nav/footer links by text length
 * 4. Parse date + title from each link text
 * 5. Fall back to heading-level text extraction if no links found
 */
async function scrapeUniversal(galleryConfig) {
  const exhibitions = [];
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);

    const pathsToTry = [
      galleryConfig.exhibitionsPath,
      '/exhibitions',
      '/gallery-exhibitions',
      '/shows',
      '/program',
      '/current',
      '/exhibitions/past',
    ];

    let raw = [];
    for (const path of pathsToTry) {
      const url = `${galleryConfig.url}${path}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

        // Strategy 1: links to individual exhibition pages
        raw = await page.evaluate(() => {
          const items = [];
          document
            .querySelectorAll('a[href*="exhibition"], a[href*="show"], a[href*="program"]')
            .forEach((el) => {
              const href = el.href;
              const text = el.textContent.trim().replace(/\s+/g, ' ');
              if (
                text.length > 12 &&
                text.length < 600 &&
                !text.match(/^(Exhibitions|Gallery|Artists|Archive|Filter|Past|Current|Upcoming|View All|Skip to|Accept|Museum|Public|Shows?|Program|Online Viewing Room|\d{4}[-–]\d{4})$/i)
              ) {
                items.push({ href, text });
              }
            });
          return [...new Map(items.map((i) => [i.href, i])).values()].slice(0, 40);
        });

        // Strategy 2: exhibition cards / structured containers on the same page
        if (raw.length < 3) {
          const cardData = await page.evaluate(() => {
            const items = [];
            // Look for containers that have both an artist name and a date
            const candidates = document.querySelectorAll(
              'article, [class*="exhibition"], [class*="show"], [class*="item"], [class*="card"], [class*="listing"], li'
            );
            candidates.forEach((el) => {
              const text = el.textContent.trim().replace(/\s+/g, ' ');
              // Must contain a date-like pattern and be substantial
              if (
                text.length > 20 &&
                text.length < 500 &&
                text.match(/\d{4}/) &&
                !text.match(/^(Exhibitions|Artists|Archive|Filter|Past|Current|Upcoming)$/i)
              ) {
                // Use only the direct text, not nested containers (avoid duplicates)
                const directText = [...el.childNodes]
                  .map((n) => n.textContent?.trim() || '')
                  .filter(Boolean)
                  .join(' ')
                  .replace(/\s+/g, ' ')
                  .slice(0, 300);
                if (directText.length > 15) {
                  items.push({ href: el.querySelector('a')?.href || '', text: directText });
                }
              }
            });
            // Deduplicate by first 40 chars
            const seen = new Set();
            return items.filter((i) => {
              const key = i.text.slice(0, 40);
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            }).slice(0, 40);
          });
          if (cardData.length > raw.length) raw = cardData;
        }

        if (raw.length > 0) break;
      } catch (_) {}
    }

    // If still nothing, scrape headings
    if (raw.length === 0) {
      const headingData = await page.evaluate(() => {
        return [...document.querySelectorAll('h1, h2, h3')]
          .map((h) => h.textContent.trim().replace(/\s+/g, ' '))
          .filter((t) => t.length > 5 && t.length < 200)
          .slice(0, 20)
          .map((text) => ({ href: '', text }));
      });
      raw = headingData;
    }

    for (const item of raw) {
      const text = item.text;
      const slug = (item.href || '').split('/').filter(Boolean).pop() || '';

      // Date range — also handles "through April 25, 2026" (single endpoint)
      const dateMatch =
        text.match(
          /([A-Z][a-z]{1,8}\.?\s+\d{1,2}(?:,?\s*\d{4})?[\s–\-—]+[A-Z][a-z]{1,8}\.?\s+\d{1,2},?\s*\d{4})/
        ) ||
        text.match(/((?:through|Through|thru)\s+[A-Z][a-z]{1,8}\.?\s+\d{1,2},?\s*\d{4})/) ||
        text.match(/([A-Z][a-z]{1,8}\.?\s+\d{1,2},?\s*\d{4}\s*–\s*[A-Z][a-z]{1,8}\.?\s+\d{1,2},?\s*\d{4})/);
      const dates = dateMatch ? dateMatch[0] : '';
      const withoutDates = text.replace(dates, '').trim();

      // Known location patterns
      const locationMatch = withoutDates.match(
        /(New York|Los Angeles|London|Paris|Hong Kong|Berlin|Seoul|Zürich|Zurich|Chelsea|Chelsea, NY|West \d+[a-z]* Street|\d+ (?:West|East) [\w\s]+Street)\s*(?:,\s*)?/i
      );
      const location = locationMatch ? locationMatch[1].trim() : '';
      const titleBlock = withoutDates.replace(locationMatch ? locationMatch[0] : '', '').trim();

      // Try artist/title split using slug
      const { artist, title } = splitArtistTitle(titleBlock, slug);

      if (title || titleBlock) {
        exhibitions.push({
          title: title || titleBlock,
          artists: artist,
          dates,
          location,
        });
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

  // Featured gallery custom scrapers
  if (name.includes('zwirner')) {
    exhibitions = await scrapeDavidZwirner();
  } else if (name.includes('paula cooper')) {
    exhibitions = await scrapePaulaCooper();
  } else if (name.includes('gagosian')) {
    exhibitions = await scrapeGagosian();
  } else if (name.includes('hauser')) {
    exhibitions = await scrapeHauserWirth();
  } else if (name.includes('pace gallery') || name === 'pace') {
    exhibitions = await scrapePaceGallery();
  }

  // All standard galleries use the universal scraper
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
