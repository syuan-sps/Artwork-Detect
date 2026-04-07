const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert art world analyst with deep knowledge of the contemporary gallery ecosystem in New York and internationally.
You analyze raw scraped exhibition data from gallery websites and synthesize structured, insightful curatorial profiles.
The data may contain some parsing artifacts (e.g. artist and exhibition title merged in one field, or minor formatting issues from web scraping) — use your art world knowledge to interpret the data correctly.
Always respond with valid JSON only — no markdown fences, no preamble, no commentary outside the JSON.`;

const USER_PROMPT_TEMPLATE = (galleryName, exhibitions) => `
Analyze the following exhibition data scraped from ${galleryName}'s website and return a JSON object with this exact structure:

{
  "summary": "A 2-4 sentence plain-language summary starting with 'This gallery tends to show...' that captures the gallery's curatorial identity, aesthetic sensibility, and position in the art world",
  "mediums": ["ranked list of primary mediums from most to least prominent, e.g. painting, sculpture, video, photography, drawing, installation, ceramics, textile, print"],
  "themes": ["recurring subjects, conceptual threads, and content areas appearing across the programming"],
  "movements": ["art historical movements, styles, and critical categories the programming connects to"],
  "artistProfile": {
    "emergingVsEstablished": "concrete description: what percentage roughly emerging vs mid-career vs established, and any notable patterns",
    "nationalityPatterns": "specific observations: which nationalities/regions are over- or under-represented, any explicit international focus",
    "genderNotes": "honest assessment of gender balance inferred from artist names and known gallery reputations; note if data is insufficient",
    "generationalFocus": "birth decade ranges of artists shown, whether the gallery favors historical estates, boomers, gen-X, younger artists"
  },
  "programmingPatterns": "specific structural observations: solo vs group ratio, show duration patterns, thematic vs monographic, any recurring formats or series",
  "notableStrengths": ["2-4 specific, concrete strengths that distinguish this gallery's program from peers"],
  "exhibitionCount": <exact number of exhibitions in the provided data>
}

Important notes for interpretation:
- Some entries may have the artist name and exhibition title merged together (a scraping artifact) — use your knowledge of these artists and galleries to correctly attribute them
- Exhibition titles shown in ALL CAPS are often correct verbatim titles
- If an entry appears to be artist name only (no separate title), it's likely a solo show where the artist's name serves as the show identifier
- Dates may span multiple years for long-running or traveling shows
- Location names (New York, London, Paris, etc.) indicate gallery branches, not the artist's origin

Exhibition data:
${JSON.stringify(exhibitions, null, 2)}

Return only the JSON object. Be analytically rigorous and specific — avoid vague platitudes. Draw on your knowledge of these artists and this gallery's history where relevant.
`;

async function synthesizeProfile(galleryName, exhibitions) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackProfile(galleryName, exhibitions);
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: USER_PROMPT_TEMPLATE(galleryName, exhibitions.slice(0, 60)),
        },
      ],
    });

    const text = message.content[0].text.trim();
    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Claude synthesis error:', err.message);
    return buildFallbackProfile(galleryName, exhibitions);
  }
}

function buildFallbackProfile(galleryName, exhibitions) {
  return {
    summary: `This gallery (${galleryName}) has ${exhibitions.length} exhibitions in the scraped data. AI synthesis is unavailable — add an ANTHROPIC_API_KEY to enable curatorial analysis.`,
    mediums: [],
    themes: [],
    movements: [],
    artistProfile: {
      emergingVsEstablished: 'Data unavailable',
      nationalityPatterns: 'Data unavailable',
      genderNotes: 'Data unavailable',
      generationalFocus: 'Data unavailable',
    },
    programmingPatterns: 'Data unavailable',
    notableStrengths: [],
    exhibitionCount: exhibitions.length,
  };
}

module.exports = { synthesizeProfile };
