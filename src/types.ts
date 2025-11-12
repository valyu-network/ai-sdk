/**
 * Base configuration options for all Valyu search tools
 */
export interface ValyuBaseConfig {
  /**
   * Your Valyu API key. Get one at https://platform.valyu.ai
   * Defaults to process.env.VALYU_API_KEY
   */
  apiKey?: string;

  /**
   * Search type (default: "proprietary")
   * - proprietary: Access premium sources including academic papers, financial data, etc.
   * - web: Standard web search
   */
  searchType?: "proprietary" | "web";

  /**
   * Maximum number of results to return (default: 10)
   */
  maxNumResults?: number;

  /**
   * Maximum price per query in CPM (cost per thousand retrievals)
   * Use this to control costs
   */
  maxPrice?: number;

  /**
   * Relevance threshold (0-1) to filter results by match quality
   */
  relevanceThreshold?: number;

  /**
   * Flag for agentic integration (default: true)
   */
  isToolCall?: boolean;
}

/**
 * Configuration for web search tool
 */
export interface ValyuWebSearchConfig extends ValyuBaseConfig {
  /**
   * List of specific sources to include (e.g., ["valyu/web-general"])
   */
  includedSources?: string[];

  /**
   * Category to focus the search on
   */
  category?: string;
}

/**
 * Configuration for finance search tool
 */
export interface ValyuFinanceSearchConfig extends ValyuBaseConfig {
  /**
   * List of financial sources to include
   * Examples: ["valyu/financial-reports", "valyu/market-data"]
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "stocks", "earnings", "market-data")
   */
  category?: string;
}

/**
 * Configuration for research paper search tool
 */
export interface ValyuPaperSearchConfig extends ValyuBaseConfig {
  /**
   * List of academic sources to include
   * Examples: ["valyu/valyu-arxiv", "valyu/academic-journals"]
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "computer-science", "physics", "mathematics")
   */
  category?: string;
}

/**
 * Configuration for biomedical search tool
 */
export interface ValyuBioSearchConfig extends ValyuBaseConfig {
  /**
   * List of biomedical sources to include
   * Examples: ["valyu/valyu-pubmed", "valyu/clinical-trials", "valyu/fda-labels"]
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "clinical-trials", "drug-labels", "medical-research")
   */
  category?: string;
}

/**
 * Configuration for patent search tool
 */
export interface ValyuPatentSearchConfig extends ValyuBaseConfig {
  /**
   * List of patent sources to include
   * Examples: ["valyu/patents-us", "valyu/patents-international"]
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "technology", "pharmaceutical", "mechanical")
   */
  category?: string;
}

/**
 * Configuration for SEC filings search tool
 */
export interface ValyuSecSearchConfig extends ValyuBaseConfig {
  /**
   * List of SEC filing sources to include
   * Examples: ["valyu/valyu-sec-filings"]
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "10-K", "10-Q", "8-K", "proxy")
   */
  category?: string;
}

/**
 * Configuration for economics search tool
 */
export interface ValyuEconomicsSearchConfig extends ValyuBaseConfig {
  /**
   * List of economics sources to include
   * Examples: ["valyu/valyu-bls", "valyu/valyu-fred", "valyu/valyu-world-bank"]
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "labor-statistics", "economic-indicators", "government-spending")
   */
  category?: string;
}

/**
 * Configuration for company research tool
 */
export interface ValyuCompanyResearchConfig {
  /**
   * Your Valyu API key. Get one at https://platform.valyu.ai
   * Defaults to process.env.VALYU_API_KEY
   */
  apiKey?: string;

  /**
   * Maximum price per API call in cents (default: 100 = $1.00)
   * This controls the cost limit for each section of the research report
   */
  dataMaxPrice?: number;
}

/**
 * Source type for search results
 */
export type ValyuSourceType =
  | "general"
  | "website"
  | "forum"
  | "paper"
  | "data"
  | "report"
  | "health_data"
  | "clinical_trial"
  | "drug_label"
  | "grants";

/**
 * Data type classification
 */
export type ValyuDataType = "unstructured" | "structured";

/**
 * Search result returned from Valyu DeepSearch API
 */
export interface ValyuSearchResult {
  /** Unique identifier for the result */
  id: string;
  /** Title of the content */
  title: string;
  /** URL for the result (includes UTM parameters from Valyu) */
  url: string;
  /** Context text in markdown format with LaTeX equations where applicable */
  content: string;
  /** Source type ('web' or dataset name like 'valyu/valyu-arxiv') */
  source: string;
  /** Character count of the content */
  length: number;
  /** Cost of this result in dollars */
  price: number;
  /** Type of data */
  data_type: ValyuDataType;
  /** Specific source type (website, paper, clinical_trial, etc.) */
  source_type: ValyuSourceType;
  /** Associated image URL (if available) */
  image_url?: string | { main?: string };
  /** Publication date in YYYY-MM-DD format */
  publication_date?: string;
  /** Digital Object Identifier (for academic content) */
  doi?: string;
  /** Citation information */
  citation?: string;
  /** Number of citations (for academic papers) */
  citation_count?: number;
  /** List of author names */
  authors?: string[];
  /** Markdown references for citations in the content */
  references?: string;
  /** Any additional metadata fields */
  [key: string]: any;
}

/**
 * Count of results by source type
 */
export interface ValyuResultsBySource {
  /** Number of web results */
  web: number;
  /** Number of proprietary results */
  proprietary: number;
}

/**
 * API response from Valyu DeepSearch endpoint
 * This includes the full response with all metadata for maximum flexibility
 */
export interface ValyuApiResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Error message (empty if successful). May contain recommendations to improve search results */
  error: string;
  /** Unique transaction ID for this request */
  tx_id: string;
  /** The query string that was searched */
  query: string;
  /** Array of search results sorted by relevance */
  results: ValyuSearchResult[];
  /** Count of results by source type */
  results_by_source: ValyuResultsBySource;
  /** Total cost in cost per mille (CPM) */
  total_deduction_pcm: number;
  /** Total cost in dollars */
  total_deduction_dollars: number;
  /** Total character count of all results */
  total_characters: number;
  /** Any additional fields from the API */
  [key: string]: any;
}
