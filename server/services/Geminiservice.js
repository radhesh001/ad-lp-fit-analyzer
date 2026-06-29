import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "microsoft/phi-4:free",
  "google/gemma-3-27b-it:free",
  "mistralai/devstral-small:free",
];

const buildPrompt = (ads, landingPage) => {
  const adsBlock = ads
    .map((ad, i) => `Ad ${i + 1}:\n${ad}`)
    .join("\n\n---\n\n");

  const lpBlock = `
Title: ${landingPage.title}
Meta Description: ${landingPage.metaDesc}
H1: ${landingPage.h1}
H2s: ${landingPage.h2s}
Body Text: ${landingPage.bodyText}
  `.trim();

  return `
You are an expert conversion rate optimizer analyzing the fit between ad copy and a landing page.

ADS:
${adsBlock}

LANDING PAGE:
${lpBlock}

Analyze the mismatch across these 6 dimensions and also cluster the ads.

IMPORTANT: Your entire response must be ONLY the JSON object below. Do not write anything before or after it. No greetings, no safety notes, no explanations.

{
  "overallScore": <number 0-100>,
  "dimensions": {
    "persona": {
      "score": <0-100>,
      "adSignal": "<who the ad targets>",
      "lpSignal": "<who the LP targets>",
      "gap": "<mismatch or No gap>",
      "suggestion": "<how to fix it>"
    },
    "offer": {
      "score": <0-100>,
      "adSignal": "<what the ad promises>",
      "lpSignal": "<what the LP delivers>",
      "gap": "<mismatch or No gap>",
      "suggestion": "<how to fix it>"
    },
    "productFraming": {
      "score": <0-100>,
      "adSignal": "<how the ad frames the product>",
      "lpSignal": "<how the LP frames the product>",
      "gap": "<mismatch or No gap>",
      "suggestion": "<how to fix it>"
    },
    "proof": {
      "score": <0-100>,
      "adSignal": "<proof elements in ad>",
      "lpSignal": "<proof elements on LP>",
      "gap": "<mismatch or No gap>",
      "suggestion": "<how to fix it>"
    },
    "objections": {
      "score": <0-100>,
      "adSignal": "<objections the ad addresses>",
      "lpSignal": "<objections the LP addresses>",
      "gap": "<mismatch or No gap>",
      "suggestion": "<how to fix it>"
    },
    "aboveFoldContinuity": {
      "score": <0-100>,
      "adSignal": "<ad headline / hook>",
      "lpSignal": "<LP H1 and first visible content>",
      "gap": "<mismatch or No gap>",
      "suggestion": "<how to fix it>"
    }
  },
  "adClusters": [
    {
      "clusterName": "<angle name>",
      "adIndexes": [<0-based indexes>],
      "suggestedLPSections": ["<section 1>", "<section 2>", "<section 3>"]
    }
  ]
}
`;
};

// Extract JSON from model response even if it has extra text around it
const extractJSON = (text) => {
  // Strip markdown fences
  let clean = text.replace(/```json|```/g, "").trim();

  // Try parsing as-is first
  try {
    return JSON.parse(clean);
  } catch {
    // Find the first { and last } and extract just that block
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      const jsonBlock = clean.slice(start, end + 1);
      return JSON.parse(jsonBlock); // throws if still invalid
    }

    throw new Error(`No valid JSON found in response: ${clean.slice(0, 100)}`);
  }
};

const analyzeFit = async (ads, landingPage) => {
  const prompt = buildPrompt(ads, landingPage);
  let lastError = null;

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    console.log(`Trying model ${i + 1}/${MODELS.length}: ${model}`);

    try {
      const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.choices[0].message.content;
      console.log(`Raw response preview: ${text.slice(0, 120)}`);

      const parsed = extractJSON(text);
      console.log(`Success with: ${model}`);
      return parsed;

    } catch (err) {
      console.warn(`Model ${model} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message}`);
};

export default analyzeFit;