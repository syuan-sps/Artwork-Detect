const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert art world analyst specializing in contemporary gallery programming.
You will be given raw scraped exhibition data from a gallery website and asked to synthesize a structured curatorial profile.
Always respond with valid JSON only — no markdown fences, no extra commentary.`;

const USER_PROMPT_TEMPLATE = (galleryName, exhibitions) => `
Analyze the following exhibition data from ${galleryName} and return a JSON object with this exact structure:

{
  "summary": "A 2-3 sentence plain-language summary starting with 'This gallery tends to show...'",
  "mediums": ["list", "of", "primary", "mediums"],
  "themes": ["recurring", "themes", "or", "subjects"],
  "movements": ["art", "movements", "or", "styles"],
  "artistProfile": {
    "emergingVsEstablished": "brief description of the balance",
    "nationalityPatterns": "observations about geographic/national diversity",
    "genderNotes": "observations about gender representation where inferable from names",
    "generationalFocus": "observations about artist generations"
  },
  "programmingPatterns": "description of how they structure shows (solo vs group, thematic, etc.)",
  "notableStrengths": ["strength1", "strength2"],
  "exhibitionCount": <number of exhibitions in the data>
}

Exhibition data:
${JSON.stringify(exhibitions, null, 2)}

Return only the JSON object. Be specific and insightful where possible, but acknowledge where data is limited.
`;

async function synthesizeProfile(galleryName, exhibitions) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackProfile(galleryName, exhibitions);
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
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
