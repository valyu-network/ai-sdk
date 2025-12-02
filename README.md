# @valyu/ai-sdk

AI SDK tools for Valyu search API, built for Vercel AI SDK v5.

## Installation

```bash
npm install @valyu/ai-sdk
```

## Quick Start

Get started with web search in seconds:

```typescript


import { webSearch } from "@valyu/ai-sdk"; 
import { openai } from "@ai-sdk/openai";
// Available specialised search tools: financeSearch, paperSearch, 
// bioSearch, patentSearch, secSearch, economicsSearch, companyResearch

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Latest data center projects for AI inference workloads?',
  tools: {
    webSearch: webSearch(),
  },
});

console.log(text);
```

**That's it!** Get your free API key from the [Valyu Platform](https://platform.valyu.ai) - $10 in free credits when you sign up.

## Need Specialized Search?

Beyond general web search, Valyu provides domain-specific tools for specialized research where you can plug directly into:

- **financeSearch** - Stock prices, earnings, insider transactions, dividends, balance sheets, income statements, and more
- **paperSearch** - Full-text search of PubMed, arXiv, bioRxiv, medRxiv, and other scholarly articles
- **bioSearch** - Clinical trials, FDA drug labels, peer-reviewed biomedical research, PubMed, medRxiv, bioRxiv
- **patentSearch** - USPTO full-text patent search and related intellectual property
- **secSearch** - SEC filings including 10-K, 10-Q, 8-K, and regulatory disclosures
- **economicsSearch** - Economic indicators from BLS, FRED, World Bank, USAspending, and more
- **companyResearch** - Comprehensive company research and intelligence reports

Or **create your own** custom search tool using the same API!

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Setup](#setup)
- [Available Tools](#available-tools)
  - [webSearch](#websearch)
  - [financeSearch](#financesearch)
  - [paperSearch](#papersearch)
  - [bioSearch](#biosearch)
  - [patentSearch](#patentsearch)
  - [secSearch](#secsearch)
  - [economicsSearch](#economicssearch)
  - [companyResearch](#companyresearch)
- [Create Your Own Tool](#create-your-own-tool)
- [Configuration Options](#configuration-options)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Links](#links)
- [License](#license)

## Setup

1. Get your API key from the [Valyu Platform](https://platform.valyu.ai)
2. Add it to your `.env` file:

```bash
VALYU_API_KEY=your-api-key-here
```

That's it! The package reads it automatically.

## Available Tools

### webSearch

Search the web for current information, news, articles, and general content.

```typescript
import { generateText, stepCountIs } from "ai";
import { webSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Latest data center projects for AI inference workloads?',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});
```

**Best for**: Real-time information, news, current events, general web content

### financeSearch

Search financial data including stock prices, market data, earnings reports, and financial metrics.

```typescript
import { generateText, stepCountIs } from "ai";
import { financeSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'What was the stock price of Apple from the beginning of 2020 to 14th feb?',
  tools: {
    financeSearch: financeSearch(),
  },
  stopWhen: stepCountIs(10),
});
```

**Best for**: Stock prices, earnings reports, financial statements, market data, economic indicators

### paperSearch

Search academic research papers, scholarly articles, and textbooks across all disciplines.

```typescript
import { generateText, stepCountIs } from "ai";
import { paperSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Psilocybin effects on cellular lifespan and longevity in mice?',
  tools: {
    paperSearch: paperSearch(),
  },
  stopWhen: stepCountIs(10),
});
```

**Best for**: Academic research, scientific papers, scholarly articles, arXiv papers

### bioSearch

Search biomedical literature including PubMed articles, clinical trials, and FDA drug information.

```typescript
import { generateText, stepCountIs } from "ai";
import { bioSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Summarise top completed Phase 3 metastatic melanoma trial comparing nivolumab+ipilimumab vs monotherapy',
  tools: {
    bioSearch: bioSearch(),
  },
  stopWhen: stepCountIs(10),
});
```

**Best for**: Medical research, clinical trials, drug information, disease studies, FDA labels

### patentSearch

Search patent databases for inventions, innovations, and intellectual property.

```typescript
import { generateText, stepCountIs } from "ai";
import { patentSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Find patents published in 2025 for high energy laser weapon systems',
  tools: {
    patentSearch: patentSearch({ maxNumResults: 2 }),
  },
  stopWhen: stepCountIs(10),
});
```

**Best for**: Patent information, prior art, inventions, intellectual property

### secSearch

Search SEC filings including 10-K, 10-Q, 8-K, and other regulatory documents.

```typescript
import { generateText, stepCountIs } from "ai";
import { secSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Summarise MD&A section of Tesla\'s latest 10-k filling',
  tools: {
    secSearch: secSearch(),
  },
  stopWhen: stepCountIs(10),
});
```

**Best for**: SEC filings, annual reports, quarterly reports, proxy statements, regulatory disclosures

### economicsSearch

Search economic data including labor statistics, Federal Reserve data, World Bank indicators, and US federal spending.

```typescript
import { generateText, stepCountIs } from "ai";
import { economicsSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'What is CPI vs unemployment since 2020 in the US?',
  tools: {
    economicsSearch: economicsSearch(),
  },
  stopWhen: stepCountIs(10),
});
```

**Best for**: Labor statistics (BLS), Federal Reserve economic data (FRED), World Bank indicators, unemployment rates, GDP, inflation, government spending

### companyResearch

Generate comprehensive company intelligence reports with business overview, financials, SEC filings, news, insider activity, and citations.

```typescript
import { generateText, stepCountIs } from "ai";
import { companyResearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Research the company nia AI',
  tools: {
    companyResearch: companyResearch(),
  },
  stopWhen: stepCountIs(5),
});
```

**Best for**: In-depth company research, due diligence, competitive intelligence, investment research. Automatically gathers data in parallel from multiple sources and synthesizes into a structured markdown report. Supports optional section filtering (summary, leadership, products, funding, competitors, filings, financials, news, insiders).

**Note**: This tool automatically detects whether the company is public or private. For public companies, it returns information from SEC filings, financial statements, and other disclosures. For private companies, it pulls available data from news, funding, and other public sources.

## Create Your Own Tool

Want to build a custom search tool? Use the Valyu DeepSearch API directly with the Vercel AI SDK `tool()` function:

```typescript
import { tool } from "ai";
import { z } from "zod";

export function myCustomSearch(config = {}) {
  const apiKey = config.apiKey || process.env.VALYU_API_KEY;

  return tool({
    description: "Search for [your specific domain/use case]",
    inputSchema: z.object({
      query: z.string().describe("The search query"),
    }),
    execute: async ({ query }) => {
      const response = await fetch("https://api.valyu.ai/v1/deepsearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          query,
          max_num_results: 5,
          search_type: "all", // or "web", "proprietary"
          included_sources: ["your-custom-sources"], // optional
          // Add more parameters as needed
        }),
      });


      // Optionally filter api response

      const data = await response.json();
      return data;
    },
  });
}
```

Check out the [Valyu API Documentation](https://docs.valyu.ai) for all available parameters and data sources.

## Links

- [Valyu Platform](https://platform.valyu.ai) - Get your API keys
- [Valyu Documentation](https://docs.valyu.ai) - Full API documentation
- [Valyu Website](https://valyu.ai) - Learn more about Valyu
- [GitHub Repository](https://github.com/valyu/valyu-ai-sdk) - View source code

## License

MIT

---

Built with Valyu's API - Powering AI agents with state-of-the-art search capabilities.
