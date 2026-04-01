import { tool } from "ai";
import { z } from "zod";
import { valyuFetch } from "./http.js";

/**
 * Configuration for datasources tool
 */
export interface ValyuDatasourcesConfig {
  /**
   * Your Valyu API key. Get one at https://platform.valyu.ai
   * Defaults to process.env.VALYU_API_KEY
   */
  apiKey?: string;
}

/**
 * Creates a datasources discovery tool powered by Valyu for use with Vercel AI SDK
 *
 * This tool allows AI agents to discover available data sources before searching,
 * enabling more targeted and efficient queries.
 *
 * @param config - Configuration options for the Valyu datasources tool
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { datasources } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'What data sources are available for financial research?',
 *   tools: {
 *     datasources: datasources(),
 *   },
 * });
 * ```
 */
export function datasources(config: ValyuDatasourcesConfig = {}) {
  const { apiKey = process.env.VALYU_API_KEY } = config;

  return tool({
    description: "Discover available data sources in the Valyu network. Use this to find what sources are available before searching, filtered optionally by category.",
    inputSchema: z.object({
      category: z.string().optional().describe("Filter datasources by category (e.g., 'finance', 'biomedical', 'legal'). Use datasourcesCategories to see available categories."),
    }),
    execute: async ({ category }) => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      // Build endpoint with optional category parameter
      let endpoint = "/datasources";
      if (category) {
        endpoint += `?category=${encodeURIComponent(category)}`;
      }

      try {
        const response = await valyuFetch(endpoint, apiKey, {
          method: "GET",
          contentType: false,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Valyu API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch datasources from Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}

/**
 * Creates a datasources categories tool powered by Valyu for use with Vercel AI SDK
 *
 * This tool allows AI agents to discover available datasource categories,
 * which can then be used to filter the datasources tool.
 *
 * @param config - Configuration options for the Valyu datasources categories tool
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { datasourcesCategories } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'What categories of data are available?',
 *   tools: {
 *     datasourcesCategories: datasourcesCategories(),
 *   },
 * });
 * ```
 */
export function datasourcesCategories(config: ValyuDatasourcesConfig = {}) {
  const { apiKey = process.env.VALYU_API_KEY } = config;

  return tool({
    description: "List all available datasource categories in the Valyu network. Use this to see what categories can be used to filter the datasources tool.",
    inputSchema: z.object({}),
    execute: async () => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      try {
        const response = await valyuFetch("/datasources/categories", apiKey, {
          method: "GET",
          contentType: false,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Valyu API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch datasource categories from Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
