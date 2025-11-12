import { tool } from "ai";
import { z } from "zod";
import type { ValyuCompanyResearchConfig } from "./types.js";

/**
 * Creates a company research tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu company research
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { companyResearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'Research Apple Inc',
 *   tools: {
 *     companyResearch: companyResearch(),
 *   },
 * });
 * ```
 */
export function companyResearch(config: ValyuCompanyResearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    dataMaxPrice = 100,
  } = config;

  return tool({
    description: "Comprehensive company intelligence report. Automatically gathers and synthesizes information about a company including business overview, leadership team, financials (if public), recent news, SEC filings, funding, competitors, products, and insider activity. Returns a structured markdown report with citations. All data gathered in parallel for maximum speed. Best for in-depth company research and due diligence.",
    inputSchema: z.object({
      company: z.string().min(1).describe("Company name, ticker symbol, or domain (e.g., 'Apple', 'AAPL', 'apple.com')"),
      sections: z
        .array(
          z.enum([
            "summary",
            "leadership",
            "products",
            "funding",
            "competitors",
            "filings",
            "financials",
            "news",
            "insiders",
          ])
        )
        .optional()
        .describe(
          "Optional: Specific sections to include. If not provided, all applicable sections will be included. Available sections: 'summary' (business overview), 'leadership' (executives & board), 'products' (products & services), 'funding' (investment history), 'competitors' (competitive landscape), 'filings' (SEC filings summary), 'financials' (stock & metrics), 'news' (recent developments), 'insiders' (insider trading). Recommended: leave empty for comprehensive report, or specify 2-4 sections for focused research."
        ),
    }),
    execute: async ({ company, sections }) => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      const VALYU_API_BASE = "https://api.valyu.ai/v1";

      // Helper to check if response has insufficient information
      const hasInsufficientInfo = (content: string) => {
        if (!content) return true;
        const lowerContent = content.toLowerCase();
        return (
          lowerContent.includes("don't have enough information") ||
          lowerContent.includes("do not have enough information") ||
          lowerContent.includes("i don't have enough information") ||
          lowerContent.includes("based on the sources found") ||
          lowerContent.includes("insufficient information") ||
          lowerContent.includes("no information available") ||
          lowerContent.includes("unable to find") ||
          lowerContent.includes("cannot provide") ||
          lowerContent.includes("not available")
        );
      };

      // Helper to call Valyu Answer API
      const callAnswerAPI = async (
        query: string,
        options: {
          search_type?: string;
          included_sources?: string[];
          start_date?: string;
        } = {}
      ) => {
        const payload: any = {
          query,
          data_max_price: dataMaxPrice,
          ...options,
        };

        const response = await fetch(`${VALYU_API_BASE}/answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Valyu API error: ${response.status} - ${errorText}`);
        }

        return await response.json();
      };

      const selectedSections = sections || [
        "summary",
        "leadership",
        "products",
        "news",
        "funding",
        "competitors",
        "filings",
        "financials",
        "insiders",
      ];

      // Build all API requests in parallel
      const apiRequests: Promise<{ section: string; result: any }>[] = [];

      if (selectedSections.includes("summary")) {
        apiRequests.push(
          callAnswerAPI(
            `Provide a comprehensive business overview of ${company}. Include: company description, industry, headquarters location, founding year, key products/services, and market position. Be factual and cite sources.`,
            { search_type: "all" }
          ).then((result) => ({ section: "summary", result }))
        );
      }

      if (selectedSections.includes("leadership")) {
        apiRequests.push(
          callAnswerAPI(
            `Who are the key leaders and executives at ${company}? Include CEO, founders, C-suite executives, and board members with their names, titles, and brief backgrounds.`,
            { search_type: "all" }
          ).then((result) => ({ section: "leadership", result }))
        );
      }

      if (selectedSections.includes("products")) {
        apiRequests.push(
          callAnswerAPI(
            `What are the main products and services offered by ${company}? Describe their key offerings, target markets, and product strategy.`,
            { search_type: "all" }
          ).then((result) => ({ section: "products", result }))
        );
      }

      if (selectedSections.includes("news")) {
        apiRequests.push(
          callAnswerAPI(
            `What are the most significant recent news and developments about ${company} in the last 30 days? Summarize key events, announcements, and market reactions with specific dates and sources.`,
            {
              search_type: "all",
              start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            }
          ).then((result) => ({ section: "news", result }))
        );
      }

      if (selectedSections.includes("funding")) {
        apiRequests.push(
          callAnswerAPI(
            `What is the funding history and financial backing of ${company}? Include funding rounds, investors, total capital raised, and valuation if available.`,
            { search_type: "all" }
          ).then((result) => ({ section: "funding", result }))
        );
      }

      if (selectedSections.includes("competitors")) {
        apiRequests.push(
          callAnswerAPI(
            `Who are the main competitors of ${company}? List direct competitors and describe the competitive landscape in their industry.`,
            { search_type: "all" }
          ).then((result) => ({ section: "competitors", result }))
        );
      }

      if (selectedSections.includes("filings")) {
        apiRequests.push(
          callAnswerAPI(
            `Summarize the key points from ${company}'s most recent SEC filings (10-K, 10-Q). Focus on business highlights, financial performance, and risk factors.`,
            {
              search_type: "proprietary",
              included_sources: ["valyu/valyu-sec-filings"],
            }
          ).then((result) => ({ section: "filings", result }))
        );
      }

      if (selectedSections.includes("financials")) {
        apiRequests.push(
          callAnswerAPI(
            `Provide current financial metrics for ${company}: stock price, market cap, revenue, earnings, P/E ratio, and recent financial performance.`,
            { search_type: "all" }
          ).then((result) => ({ section: "financials", result }))
        );
      }

      if (selectedSections.includes("insiders")) {
        apiRequests.push(
          callAnswerAPI(
            `Summarize recent insider trading activity for ${company}. Include notable buys/sells by executives and board members in the last 90 days.`,
            {
              search_type: "proprietary",
              included_sources: ["valyu/valyu-insider-transactions-US"],
            }
          ).then((result) => ({ section: "insiders", result }))
        );
      }

      try {
        // Execute all requests in parallel
        const results = await Promise.allSettled(apiRequests);

        // Build the report
        let reportMarkdown = `# Company Research Report: ${company}\n\n`;
        const allSources: any[] = [];
        const sectionTitles: Record<string, string> = {
          summary: "Business Overview",
          leadership: "Leadership & Key People",
          products: "Products & Services",
          news: "Recent News & Developments",
          funding: "Funding & Investment",
          competitors: "Competitive Landscape",
          filings: "SEC Filings Summary",
          financials: "Financial Metrics & Stock Performance",
          insiders: "Insider Trading Activity",
        };

        for (const result of results) {
          if (result.status === "fulfilled") {
            const { section, result: apiResult } = result.value;

            if (
              apiResult.success &&
              apiResult.contents &&
              !hasInsufficientInfo(apiResult.contents)
            ) {
              reportMarkdown += `## ${sectionTitles[section]}\n\n${apiResult.contents}\n\n`;
              if (apiResult.search_results) {
                allSources.push(...apiResult.search_results);
              }
            }
          }
        }

        // Add sources/citations section
        if (allSources.length > 0) {
          reportMarkdown += `## Sources & Citations\n\n`;
          const uniqueSources = Array.from(
            new Map(allSources.map((s: any) => [s.url, s])).values()
          );
          uniqueSources.forEach((source: any, index) => {
            reportMarkdown += `${index + 1}. [${source.title || "Source"}](${source.url})${source.date ? ` - ${source.date}` : ""}\n`;
          });
        }

        return {
          company,
          report: reportMarkdown,
          sections: selectedSections,
          sources: allSources,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to generate company research report: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
