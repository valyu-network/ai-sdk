import { tool } from "ai";
import { z } from "zod";
import type { ValyuWebSearchConfig } from "./types.js";

/**
 * Creates a web search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu web search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { webSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * // Just set VALYU_API_KEY in .env, then:
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'What happened in San Francisco last week?',
 *   tools: {
 *     webSearch: webSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function webSearch(config: ValyuWebSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "all",
    maxNumResults = 5,
    ...otherOptions
  } = config;

  return tool({
    description: "Search the web for current information, news, articles, and content. Use this when you need up-to-date information or facts from the internet. Performs real-time web searches across diverse sources.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("The web search query - be specific and clear about what you're looking for"),
      includedSources: z.array(z.string()).optional().describe("Restrict search to specific domains or sources (e.g., ['nature.com', 'arxiv.org']). Cannot be used with excludedSources."),
      excludedSources: z.array(z.string()).optional().describe("Exclude specific domains or sources from results (e.g., ['reddit.com', 'quora.com']). Cannot be used with includedSources."),
    }),
    execute: async ({ query, includedSources, excludedSources }) => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      // Build the request body for Valyu API
      const requestBody: any = {
        query,
        search_type: searchType,
        max_num_results: maxNumResults,
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
      // Priority: input params > config options
      if (includedSources && includedSources.length > 0) {
        requestBody.included_sources = includedSources;
      } else if (otherOptions.includedSources && otherOptions.includedSources.length > 0) {
        requestBody.included_sources = otherOptions.includedSources;
      }
      if (excludedSources && excludedSources.length > 0) {
        requestBody.excluded_sources = excludedSources;
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
          throw new Error(`Failed to search with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
