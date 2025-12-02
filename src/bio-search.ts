import { tool } from "ai";
import { z } from "zod";
import type { ValyuBioSearchConfig } from "./types.js";

/**
 * Creates a biomedical search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu biomedical search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { bioSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'Find clinical trials for cancer immunotherapy',
 *   tools: {
 *     bioSearch: bioSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function bioSearch(config: ValyuBioSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "proprietary",
    maxNumResults = 5,
    includedSources = [
      "valyu/valyu-pubmed",
      "valyu/valyu-biorxiv",
      "valyu/valyu-medrxiv",
      "valyu/valyu-clinical-trials",
      "valyu/valyu-drug-labels",
    ],
    ...otherOptions
  } = config;

  return tool({
    description: "Search biomedical literature from PubMed, clinical trials, and FDA drug labels. The API handles natural language - use simple queries.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("Natural language query (e.g., 'GLP-1 agonists for weight loss', 'Phase 3 melanoma immunotherapy trials')"),
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
          throw new Error(`Failed to search biomedical data with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
