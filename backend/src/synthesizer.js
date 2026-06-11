const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert art world analyst with deep knowledge of the contemporary gallery ecosystem in New York and internationally.
You analyze raw scraped exhibition data from gallery websites and synthesize structured, insightful curatorial profiles.
The data may contain some parsing artifacts (e.g. artist and exhibition title merged in one field, or minor formatting issues from web scraping) — use your art world knowledge to interpret the data correctly.
Always respond with valid JSON only — no markdown fences, no preamble, no commentary outside the JSON.`;

const USER_PROMPT_TEMPLATE = (galleryName, past, current, upcoming, today) => `
Analyze the following exhibition data scraped from ${galleryName}'s website (today is ${today}).
The data is pre-sorted into past, current, and upcoming exhibitions.

Return a JSON object with this exact structure:

{
  "summary": "A 2-4 sentence plain-language summary starting with 'This gallery tends to show...' capturing curatorial identity, aesthetic sensibility, and market position",

  "pastTrends": "2-3 sentences describing concrete patterns visible in the past exhibitions: which artists, mediums, movements, themes dominated. What bets did the gallery make? What do the choices reveal about their curatorial taste?",

  "currentHighlights": "1-2 sentences on what is open right now and what it signals about the gallery's current direction or priorities",

  "upcomingChoices": "2-3 sentences analyzing what the gallery is betting on next: which artists they are platforming, what this signals about their editorial direction, any notable strategic or aesthetic pivots visible in the upcoming slate",

  "strategicTakeaway": "1-2 sentences of sharp, plain-English synthesis: what overall story do past + future together tell about this gallery's positioning and choices?",

  "mediums": ["ranked list of primary mediums, most to least prominent"],
  "themes": ["recurring subjects and conceptual threads across the full program"],
  "movements": ["art historical movements and critical categories the programming connects to"],

  "artistProfile": {
    "emergingVsEstablished": "concrete: approximate split, any trends toward newer vs more established artists",
    "nationalityPatterns": "specific: which nationalities dominate, any geographic pivots in upcoming shows",
    "genderNotes": "honest assessment from names; note if data is too thin to judge",
    "generationalFocus": "birth-decade ranges and whether the upcoming slate differs from the past"
  },

  "programmingPatterns": "solo vs group ratio, duration patterns, thematic vs monographic, any recurring formats",
  "notableStrengths": ["2-4 specific strengths distinguishing this gallery from peers"],
  "exhibitionCount": ${(past.length + current.length + upcoming.length)}
}

PAST EXHIBITIONS (${past.length}):
${JSON.stringify(past.slice(0, 40), null, 2)}

CURRENT EXHIBITIONS (${current.length}):
${JSON.stringify(current, null, 2)}

UPCOMING EXHIBITIONS (${upcoming.length}):
${JSON.stringify(upcoming, null, 2)}

Interpretation notes:
- Some entries have artist + title merged (scraping artifact) — use art world knowledge to separate them
- ALL CAPS titles are usually verbatim
- Artist name only = solo show where name serves as identifier
- Location names = gallery branches, not artist origins
- Be analytically specific — no vague platitudes. Draw on knowledge of these artists and this gallery's reputation.

Return only the JSON object.
`;

async function synthesizeProfile(galleryName, exhibitions) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackProfile(galleryName, exhibitions);
  }

  // Split by status
  const past = exhibitions.filter((e) => e.status === 'past');
  const current = exhibitions.filter((e) => e.status === 'current');
  const upcoming = exhibitions.filter((e) => e.status === 'upcoming');
  const unknown = exhibitions.filter((e) => e.status === 'unknown');

  // If we have very few dated exhibitions, include unknowns in past for richer analysis
  const effectivePast = past.length < 5 ? [...past, ...unknown] : past;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: USER_PROMPT_TEMPLATE(galleryName, effectivePast, current, upcoming, today),
        },
      ],
    });

    const text = message.content[0].text.trim();
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Claude synthesis error:', err.message);
    return buildFallbackProfile(galleryName, exhibitions);
  }
}

function buildFallbackProfile(galleryName, exhibitions) {
  return {
    summary: `This gallery (${galleryName}) has ${exhibitions.length} exhibitions in the scraped data. Add an ANTHROPIC_API_KEY to enable AI curatorial analysis.`,
    pastTrends: 'Add ANTHROPIC_API_KEY to enable analysis.',
    currentHighlights: 'Add ANTHROPIC_API_KEY to enable analysis.',
    upcomingChoices: 'Add ANTHROPIC_API_KEY to enable analysis.',
    strategicTakeaway: 'Add ANTHROPIC_API_KEY to enable analysis.',
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
