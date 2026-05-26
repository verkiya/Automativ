// geminiModelAccess.js
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!API_KEY) {
  console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  process.exit(1);
}

async function listModels() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("API Error:");
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    if (!data.models) {
      console.error("Unexpected response:");
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    const usable = data.models.filter((m) =>
      m.supportedGenerationMethods?.includes("generateContent"),
    );

    console.log("\nAvailable Gemini models:\n");

    usable.forEach((m) => {
      console.log(`${m.name}`);
    });
  } catch (err) {
    console.error("Request failed:", err);
  }
}

listModels();
