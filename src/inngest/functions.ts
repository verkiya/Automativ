import { inngest } from "@/inngest/client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" }, // 1. config
  { event: "test/hello.world" }, // 2. trigger
  async ({ event, step }) => {
    // 3. handler (THIS was missing)
    console.log("Hello world", event);

    return {
      message: "Hello world",
    };
  },
);
