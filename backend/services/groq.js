const Groq = require('groq-sdk');
const axios = require('axios');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function log(step, message) {
  console.log(`[${new Date().toISOString()}] [${step}] ${message}`);
}

function parseJsonResponse(rawText) {
  let text = rawText.trim();

  // Remove BOM and other invisible leading characters
  text = text.replace(/^\uFEFF/, '');

  // Strip markdown code fences (full or partial)
  text = text.replace(/^```(?:json)?\s*/i, '');
  text = text.replace(/\s*```$/i, '');
  text = text.trim();

  // Extract JSON object if surrounded by extra text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    text = jsonMatch[0];
  }

  return JSON.parse(text);
}

async function searchWeb(query) {
  log('TAVILY', `Starting web search for: "${query.substring(0, 60)}..."`);

  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      },
      { timeout: 30000 }
    );

    const results = response.data.results || [];
    const answer = response.data.answer || '';

    log('TAVILY', `Search complete — ${results.length} results found`);

    let searchText = `Web search answer: ${answer}\n\nTop sources:\n`;
    results.forEach((r, i) => {
      searchText += `\n[${i + 1}] ${r.title}\nURL: ${r.url}\nContent: ${r.content?.substring(0, 300)}...\n`;
    });

    return {
      text: searchText,
      urls: results.map((r) => r.url).filter(Boolean),
    };
  } catch (err) {
    log('TAVILY', `Search failed (${err.message}) — proceeding with AI knowledge only`);
    return { text: 'Web search unavailable. Use your training knowledge to analyze this claim.', urls: [] };
  }
}

async function callGroq(userMessage) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert fact-checker for Pakistan. You ONLY respond with valid JSON. Never add any text outside the JSON object.',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    max_tokens: 1000,
  });
}

async function verifyClaim(claimText) {
  try {
    log('VERIFY', `Starting verification for claim (${claimText.length} chars)`);

    const searchResults = await searchWeb(claimText);

    const userMessage = `You are HaqiqatAI, Pakistan's AI fact-checker.

CLAIM TO VERIFY: "${claimText}"

WEB SEARCH RESULTS:
${searchResults.text}

SOURCE URLs found: ${searchResults.urls.join(', ') || 'none'}

Based on the claim and web search results above, provide your fact-check analysis.

CRITICAL: Respond with ONLY a raw JSON object. No markdown, no explanation outside JSON, no code blocks. Just the JSON.

Required JSON format:
{
  "classification": "FACT" or "MISINFORMATION" or "UNVERIFIABLE" or "SATIRE",
  "confidence": <number 0-100>,
  "severity": "LOW" or "MEDIUM" or "HIGH" or "CRITICAL",
  "reasoning_english": "<2-3 sentence explanation in English>",
  "reasoning_urdu": "<اردو میں 2-3 جملے کی وضاحت>",
  "key_evidence": ["<evidence 1>", "<evidence 2>", "<evidence 3>"],
  "sources": ${JSON.stringify(searchResults.urls.slice(0, 5))},
  "claim_category": "health" or "politics" or "economy" or "social" or "science" or "other"
}`;

    log('GROQ', 'Sending claim to Llama 3.3 70B for analysis...');

    let chatCompletion;
    try {
      chatCompletion = await callGroq(userMessage);
    } catch (firstError) {
      log('GROQ', `First attempt failed (${firstError.message}) — retrying in 2 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      chatCompletion = await callGroq(userMessage);
      log('GROQ', 'Retry succeeded');
    }

    let rawText = chatCompletion.choices[0]?.message?.content || '';
    log('GROQ', `Received response (${rawText.length} chars), parsing JSON...`);

    const result = parseJsonResponse(rawText);

    if (!result.classification || result.confidence === undefined) {
      throw new Error('Invalid response structure from AI');
    }

    result.key_evidence = result.key_evidence || [];
    result.sources = result.sources?.length ? result.sources : searchResults.urls.slice(0, 5);

    log('VERIFY', `Complete — ${result.classification} at ${result.confidence}% confidence`);

    return result;
  } catch (error) {
    log('ERROR', `Verification failed: ${error.message}`);
    throw new Error(`AI verification failed: ${error.message}`);
  }
}

module.exports = { verifyClaim };
