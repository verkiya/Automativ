import { inngest } from "@/inngest/client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
const google = createGoogleGenerativeAI();
const openai = createOpenAI();
export const execute = inngest.createFunction(
  { id: "execute-ai" }, // 1. config
  { event: "execute/ai" }, // 2. trigger
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "A very short summary of AI agents",
      },
    );
    // const { steps: openAiSteps } = await step.ai.wrap(
    //   "openai-generate-text",
    //   generateText,
    //   {
    //     model: openai("gpt-5-nano"),
    //     system: "You are a helpful assistant",
    //     prompt: "a very simple chicken soup recipe",
    //   },
    // );
    //return { geminiSteps, openAiSteps };
    return geminiSteps;
  },
);
