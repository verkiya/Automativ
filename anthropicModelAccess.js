// claudeModelAccess.js

import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}

async function listModels() {
  try {
    const res = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("API Error:");
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    if (!data.data) {
      console.error("Unexpected response:");
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log("\nAvailable Claude models:\n");

    data.data.forEach((model) => {
      console.log(model.id);
    });
  } catch (err) {
    console.error("Request failed:", err);
  }
}

listModels();
