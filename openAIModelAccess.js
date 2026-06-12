// openaiModelAccess.js

import "dotenv/config";

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

async function listModels() {
  try {
    const res = await fetch(
      "https://api.openai.com/v1/models",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

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

    console.log("\nAvailable OpenAI models:\n");

    data.data
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((model) => {
        console.log(model.id);
      });
  } catch (err) {
    console.error("Request failed:", err);
  }
}

listModels();
