import "dotenv/config";

const fetch = global.fetch;

async function getModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
  );

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    return;
  }

  // 👉 extract model names
  const models = data.models.map((m) => m.name);

  // 👉 clean names (optional)
  const cleaned = models.map((m) => m.replace("models/", "")).sort();

  console.log(cleaned.join("\n"));
}

getModels();
