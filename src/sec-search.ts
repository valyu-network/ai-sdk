import { tool } from "ai";
import { z } from "zod";
import type { ValyuSecSearchConfig } from "./types.js";
import { valyuFetch } from "./http.js";

/**
 * Creates an SEC filings search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu SEC filings search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { secSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'Find the latest 10-K filing for Tesla',
 *   tools: {
 *     secSearch: secSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function secSearch(config: ValyuSecSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "proprietary",
    maxNumResults = 5,
    includedSources = ["valyu/valyu-sec-filings", "valyu/valyu-insider-transactions-US"],
    ...otherOptions
  } = config;

  return tool({
    description: "Search SEC filings (10-K, 10-Q, 8-K, 13F-HR, Schedule 13D, Schedule 13G) and insider transactions (Form 4 structured data). Covers annual/quarterly reports, institutional holdings (13F), beneficial ownership disclosures (13D/13G), and insider trades. Use simple natural language with company name and filing type - no accession numbers or technical syntax needed.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("Natural language query (e.g., 'Tesla 10-K FY2024 risk factors', 'Apple iPhone sales 2021', 'Berkshire Hathaway 13F holdings', 'Schedule 13D activist stake in Marcus Corp', 'insider transactions for Pfizer during 2020')"),
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
      if (otherOptions.responseLength !== undefined) {
        requestBody.response_length = otherOptions.responseLength;
      }

      // Call Valyu API
      try {
        const response = await valyuFetch("/deepsearch", apiKey, {
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
          throw new Error(`Failed to search SEC filings with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
