import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: "loading" }));

  try {
    const result = await step.run(`http-request-${nodeId}`, async () => {
      if (!data.endpoint) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "HTTP Request node: No endpoint configured",
        );
      }

      if (!data.variableName) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "HTTP Request node: Variable name not configured",
        );
      }

      if (!data.method) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("HTTP Request node: Method not configured");
      }

      const endpointTemplate = data.endpoint;
      const variableName = data.variableName;

      // URL and JSON templates need literal &, =, quotes, and slashes rather
      // than Handlebars' default HTML entities.
      const endpoint = Handlebars.compile(endpointTemplate, {
        noEscape: true,
      })(context);
      if (!endpoint || typeof endpoint !== "string") {
        throw new NonRetriableError(
          "Endpoint template must resolve to a non-empty string",
        );
      }
      const method = data.method;
      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}", {
          noEscape: true,
        })(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = { "Content-Type": "application/json" };
      }
      try {
        new URL(endpoint);
      } catch {
        throw new NonRetriableError(
          `Endpoint must resolve to a valid URL. Got: ${endpoint}`,
        );
      }
      const response = await ky(endpoint, {
        ...options,
        throwHttpErrors: false,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      return {
        ...context,
        [variableName]: {
          httpResponse: {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          },
        },
      };
    });

    await publish(httpRequestChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));

    throw error;
  }
};
