# Valyu AI SDK Examples

Simple examples demonstrating each tool in the Valyu AI SDK.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your API keys in `.env`:
```bash
VALYU_API_KEY=your-valyu-api-key
OPENAI_API_KEY=your-openai-api-key
```

## Running Examples

Each example demonstrates a different Valyu search tool:

```bash
# Web Search
node examples/web-search.js

# Finance Search
node examples/finance-search.js

# Research Paper Search
node examples/paper-search.js

# Biomedical Search
node examples/bio-search.js

# Patent Search
node examples/patent-search.js

# SEC Filings Search
node examples/sec-search.js

# Economics Search
node examples/economics-search.js

# Company Research
node examples/company-research.js
```

## What Each Example Does

- **web-search.js**: Searches the web for current information
- **finance-search.js**: Searches financial data (stocks, earnings, etc.)
- **paper-search.js**: Searches academic papers from arXiv, PubMed, etc.
- **bio-search.js**: Searches biomedical literature and clinical trials
- **patent-search.js**: Searches patent databases
- **sec-search.js**: Searches SEC filings (10-K, 10-Q, etc.)
- **economics-search.js**: Searches economic indicators (BLS, FRED, World Bank)
- **company-research.js**: Generates comprehensive company intelligence reports

All examples use `streamText` to demonstrate real-time streaming responses with GPT-5.
