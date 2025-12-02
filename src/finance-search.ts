import { tool } from "ai";
import { z } from "zod";
import type { ValyuFinanceSearchConfig } from "./types.js";

/**
 * Creates a finance search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu finance search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { financeSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'What are the latest earnings reports for Apple?',
 *   tools: {
 *     financeSearch: financeSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function financeSearch(config: ValyuFinanceSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "proprietary",
    maxNumResults = 5,
    includedSources = [
      "valyu/valyu-stocks",
      "valyu/valyu-sec-filings",
      "valyu/valyu-earnings-US",
      "valyu/valyu-balance-sheet-US",
      "valyu/valyu-income-statement-US",
      "valyu/valyu-cash-flow-US",
      "valyu/valyu-dividends-US",
      "valyu/valyu-insider-transactions-US",
      "valyu/valyu-market-movers-US",
      "valyu/valyu-crypto",
      "valyu/valyu-forex",
      "valyu/valyu-bls",
      "valyu/valyu-fred",
      "valyu/valyu-world-bank",
    ],
    ...otherOptions
  } = config;

  return tool({
    description: "Search financial data: stock prices, earnings, balance sheets, income statements, cash flows, SEC filings, dividends, insider transactions, crypto, forex, and economic indicators. The API handles natural language - ask your full question in one query per topic.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("Natural language query (e.g., 'Apple stock price Q1-Q3 2020', 'Tesla revenue last 4 quarters')"),
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
          throw new Error(`Failed to search financial data with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
