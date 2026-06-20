const MODELS = [
  { model: "gemini-3.1-flash-lite", weight: 70 },
  { model: "gemini-2.5-flash-lite", weight: 20 },
  { model: "gemini-3.5-flash", weight: 5 },
  { model: "gemini-2.5-flash", weight: 5 },
] as const;

export function selectGeminiModel() {
  const totalWeight = MODELS.reduce(
    (sum, item) => sum + item.weight,
    0,
  );

  let random = Math.random() * totalWeight;

  for (const item of MODELS) {
    random -= item.weight;

    if (random <= 0) {
      return item.model;
    }
  }

  return MODELS[0].model;
}
