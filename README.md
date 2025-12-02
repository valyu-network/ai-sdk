# Valyu AI SDK

Give your AI agents access to real-time web data and specialized knowledge with Valyu's DeepSearch API. Add powerful search capabilities to your LLMs in just a few lines of code. Works seamlessly with AI SDK by Vercel.

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
  prompt: 'Latest data center projects for AI inference workloads',
  tools: {
    webSearch: webSearch(),
  },
});

console.log(text);
```

**That's it!** Get your free API key from the [Valyu Platform](https://platform.valyu.ai) - $10 in free credits when you sign up.

## Need Specialized Search?

Beyond general web search, Valyu provides domain-specific tools for specialized research:

- **financeSearch** - Stock prices, earnings, market data
- **paperSearch** - Academic papers, arXiv, scholarly articles
- **bioSearch** - Medical research, clinical trials, PubMed
- **patentSearch** - Patent databases, prior art, inventions
- **secSearch** - SEC filings, 10-K, 10-Q, regulatory documents
- **economicsSearch** - BLS, FRED, World Bank economic indicators
- **companyResearch** - Comprehensive company intelligence reports

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
import { webSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'What happened in AI tech news last week?',
  tools: {
    webSearch: webSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: Real-time information, news, current events, general web content

### financeSearch

Search financial data including stock prices, market data, earnings reports, and financial metrics.

```typescript
import { financeSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'What are Apple\'s latest earnings?',
  tools: {
    financeSearch: financeSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: Stock prices, earnings reports, financial statements, market data, economic indicators

### paperSearch

Search academic research papers, scholarly articles, and textbooks across all disciplines.

```typescript
import { paperSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Find recent research on transformer neural networks',
  tools: {
    paperSearch: paperSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: Academic research, scientific papers, scholarly articles, arXiv papers

### bioSearch

Search biomedical literature including PubMed articles, clinical trials, and FDA drug information.

```typescript
import { bioSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Find clinical trials for cancer immunotherapy',
  tools: {
    bioSearch: bioSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: Medical research, clinical trials, drug information, disease studies, FDA labels

### patentSearch

Search patent databases for inventions, innovations, and intellectual property.

```typescript
import { patentSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Find patents related to quantum computing',
  tools: {
    patentSearch: patentSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: Patent information, prior art, inventions, intellectual property

### secSearch

Search SEC filings including 10-K, 10-Q, 8-K, and other regulatory documents.

```typescript
import { secSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Find Tesla\'s latest 10-K filing',
  tools: {
    secSearch: secSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: SEC filings, annual reports, quarterly reports, proxy statements, regulatory disclosures

### economicsSearch

Search economic data including labor statistics, Federal Reserve data, World Bank indicators, and US federal spending.

```typescript
import { economicsSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'What is the current US unemployment rate?',
  tools: {
    economicsSearch: economicsSearch({ maxNumResults: 5 }),
  },
});
```

**Best for**: Labor statistics (BLS), Federal Reserve economic data (FRED), World Bank indicators, unemployment rates, GDP, inflation, government spending

### companyResearch

Generate comprehensive company intelligence reports with business overview, financials, SEC filings, news, insider activity, and citations.

```typescript
import { companyResearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Research Apple Inc',
  tools: {
    companyResearch: companyResearch(),
  },
});
```

**Best for**: In-depth company research, due diligence, competitive intelligence, investment research. Automatically gathers data in parallel from multiple sources and synthesizes into a structured markdown report. Supports optional section filtering (summary, leadership, products, funding, competitors, filings, financials, news, insiders).

**Note**: This tool uses the Valyu Answer API which provides AI-synthesized responses with citations. Costs are controlled via the `dataMaxPrice` parameter (default: $1.00 per section).

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

      const data = await response.json();
      return data;
    },
  });
}
```

Check out the [Valyu API Documentation](https://docs.valyu.ai) for all available parameters and data sources.

## Configuration Options

All tools support these configuration options:

```typescript
{
  // API key (defaults to process.env.VALYU_API_KEY)
  apiKey?: string;

  // Search type: "proprietary" (premium sources) or "web" (default: "proprietary")
  searchType?: "proprietary" | "web";

  // Maximum number of results (default: 10)
  maxNumResults?: number;

  // Maximum price per query in CPM (cost per thousand retrievals)
  maxPrice?: number;

  // Relevance threshold (0-1) to filter results by quality
  relevanceThreshold?: number;

  // Category to focus the search on
  category?: string;

  // Specific sources to include (dataset identifiers)
  includedSources?: string[];

  // Flag for agentic integration (default: true)
  isToolCall?: boolean;
}
```

## Examples

### Multi-Tool Search

Combine multiple search tools for comprehensive research:

```typescript
import { generateText } from "ai";
import { paperSearch, bioSearch, financeSearch } from "@valyu/ai-sdk";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Research the commercialization of CRISPR technology',
  tools: {
    papers: paperSearch({ maxNumResults: 3 }),
    medical: bioSearch({ maxNumResults: 3 }),
    finance: financeSearch({ maxNumResults: 3 }),
  },
});
```

### Custom Configuration

Use advanced options to fine-tune your searches:

```typescript
import { webSearch } from "@valyu/ai-sdk";

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Find high-quality analysis of the latest AI trends',
  tools: {
    webSearch: webSearch({
      maxNumResults: 10,
      searchType: "proprietary",
      relevanceThreshold: 0.8,  // High relevance only
      maxPrice: 0.01,            // Cost control
    }),
  },
});
```

### Streaming Results

Use with `streamText` for real-time responses:

```typescript
import { streamText } from "ai";
import { paperSearch } from "@valyu/ai-sdk";
import { anthropic } from "@ai-sdk/anthropic";

const result = streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  prompt: 'Summarize recent quantum computing research',
  tools: {
    papers: paperSearch(),
  },
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## TypeScript Support

Full TypeScript types included:

```typescript
import {
  webSearch,
  ValyuWebSearchConfig,
  ValyuSearchResult,
  ValyuApiResponse
} from "@valyu/ai-sdk";

const config: ValyuWebSearchConfig = {
  maxNumResults: 10,
  searchType: "proprietary",
  relevanceThreshold: 0.7,
};

const search = webSearch(config);
```

### Available Types

- `ValyuBaseConfig` - Base configuration for all tools
- `ValyuWebSearchConfig` - Web search configuration
- `ValyuFinanceSearchConfig` - Finance search configuration
- `ValyuPaperSearchConfig` - Research paper search configuration
- `ValyuBioSearchConfig` - Biomedical search configuration
- `ValyuPatentSearchConfig` - Patent search configuration
- `ValyuSecSearchConfig` - SEC filings search configuration
- `ValyuEconomicsSearchConfig` - Economics search configuration
- `ValyuCompanyResearchConfig` - Company research configuration
- `ValyuSearchResult` - Individual search result
- `ValyuApiResponse` - API response structure

## Links

- [Valyu Platform](https://platform.valyu.ai) - Get your API keys
- [Valyu Documentation](https://docs.valyu.ai) - Full API documentation
- [Valyu Website](https://valyu.ai) - Learn more about Valyu
- [GitHub Repository](https://github.com/valyu/valyu-ai-sdk) - View source code

## Features

- **Multiple Specialized Tools**: Eight domain-specific tools including seven search tools and one comprehensive research tool
- **Premium Data Sources**: Access to academic papers (arXiv), biomedical research (PubMed), financial data, patents, SEC filings, economic indicators (BLS, FRED, World Bank), and AI-powered company intelligence
- **Real-time Search**: Get current information from across the web
- **Flexible Configuration**: Control costs, relevance thresholds, and data sources
- **Type-Safe**: Full TypeScript support with detailed type definitions
- **Easy Integration**: Works seamlessly with Vercel AI SDK
- **Generous Free Tier**: $10 in free credits when you sign up

## Cost Control

Valyu uses a CPM (cost per thousand retrievals) pricing model. Control your costs with:

```typescript
webSearch({
  maxPrice: 0.01,              // Maximum cost per query
  maxNumResults: 5,            // Limit number of results
  relevanceThreshold: 0.8,     // Only high-quality results
})
```

## License

MIT

---

Built with Valyu DeepSearch API - Powering AI agents with comprehensive search capabilities.
