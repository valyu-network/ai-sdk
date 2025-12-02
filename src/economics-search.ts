import { tool } from "ai";
import { z } from "zod";
import type { ValyuEconomicsSearchConfig } from "./types.js";

/**
 * Creates an economics and statistics search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu economics search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { economicsSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'What is the current US unemployment rate?',
 *   tools: {
 *     economicsSearch: economicsSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function economicsSearch(config: ValyuEconomicsSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "proprietary",
    maxNumResults = 3,
    includedSources = [
      "valyu/valyu-bls",
      "valyu/valyu-fred",
      "valyu/valyu-world-bank",
      "valyu/valyu-worldbank-indicators",
      "valyu/valyu-usaspending",
    ],
    ...otherOptions
  } = config;

  return tool({
    description: "Search economic data from BLS, FRED, World Bank. The API handles natural language - no need for series IDs or technical codes.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("Natural language query (e.g., 'CPI vs unemployment since 2020', 'US GDP growth last 5 years')"),
    }),
    execute: async ({ query }) => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      // Build the request body for Valyu API
      const requestBody: any = {
        query,
        search_type: searchType,
        max_num_results: maxNumResults,
        included_sources: includedSources,
      };

      // Add optional parameters
      if (otherOptions.maxPrice !== undefined) {
        requestBody.max_price = otherOptions.maxPrice;
      }
      if (otherOptions.relevanceThreshold !== undefined) {
        requestBody.relevance_threshold = otherOptions.relevanceThreshold;
      }
      if (otherOptions.category) {
        requestBody.category = otherOptions.category;
      }

      // Call Valyu API
      try {
        const response = await fetch("https://api.valyu.ai/v1/deepsearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Valyu API error: ${response.status} - ${errorText}`);
        }

        // Return the full API response
        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to search economic data with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
