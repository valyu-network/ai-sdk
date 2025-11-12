import dotenv from "dotenv";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  webSearch,
  financeSearch,
  paperSearch,
  bioSearch,
  patentSearch,
  secSearch,
  economicsSearch,
  companyResearch,
} from "@valyu/ai-sdk";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Test configuration
const TEST_TIMEOUT = 100000; // 100 seconds
const model = openai("gpt-5");

// Helper to run a test with timeout
async function runTest(name, testFn) {
  console.log(`\n🧪 Testing: ${name}`);
  const start = Date.now();

  try {
    await Promise.race([
      testFn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Test timeout")), TEST_TIMEOUT)
      ),
    ]);
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ ${name} passed (${duration}s)`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed:`, error.message);
    return false;
  }
}

// Test functions
async function testWebSearch() {
  const { text } = await generateText({
    model,
    prompt: "What is the weather like today? Use web search.",
    tools: { webSearch: webSearch({ maxNumResults: 2 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testFinanceSearch() {
  const { text } = await generateText({
    model,
    prompt: "What is Apple's stock ticker symbol?",
    tools: { financeSearch: financeSearch({ maxNumResults: 2 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testPaperSearch() {
  const { text } = await generateText({
    model,
    prompt: "Find a paper about neural networks",
    tools: { paperSearch: paperSearch({ maxNumResults: 1 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testBioSearch() {
  const { text } = await generateText({
    model,
    prompt: "What is diabetes?",
    tools: { bioSearch: bioSearch({ maxNumResults: 1 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testPatentSearch() {
  const { text } = await generateText({
    model,
    prompt: "Find a patent related to smartphones",
    tools: { patentSearch: patentSearch({ maxNumResults: 1 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testSecSearch() {
  const { text } = await generateText({
    model,
    prompt: "Find Tesla's latest SEC filing",
    tools: { secSearch: secSearch({ maxNumResults: 1 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testEconomicsSearch() {
  const { text } = await generateText({
    model,
    prompt: "What is the US unemployment rate?",
    tools: { economicsSearch: economicsSearch({ maxNumResults: 1 }) },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

async function testCompanyResearch() {
  const { text } = await generateText({
    model,
    prompt: "Research Microsoft briefly",
    tools: { companyResearch: companyResearch() },
    stopWhen: stepCountIs(3),
  });

  if (!text || text.length === 0) {
    throw new Error("No response text");
  }
}

// Main test runner
async function main() {
  console.log("🚀 Starting Valyu AI SDK Integration Tests\n");
  console.log("=" .repeat(50));

  // Check for API keys
  if (!process.env.VALYU_API_KEY) {
    console.error("❌ VALYU_API_KEY environment variable is required");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  const tests = [
    ["Web Search", testWebSearch],
    ["Finance Search", testFinanceSearch],
    ["Paper Search", testPaperSearch],
    ["Bio Search", testBioSearch],
    ["Patent Search", testPatentSearch],
    ["SEC Search", testSecSearch],
    ["Economics Search", testEconomicsSearch],
    ["Company Research", testCompanyResearch],
  ];

  const results = [];
  for (const [name, testFn] of tests) {
    const passed = await runTest(name, testFn);
    results.push({ name, passed });
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("\n📊 Test Summary:");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  results.forEach(({ name, passed }) => {
    console.log(`  ${passed ? "✅" : "❌"} ${name}`);
  });

  console.log(`\nTotal: ${passed}/${tests.length} passed`);

  if (failed > 0) {
    console.log(`\n❌ ${failed} test(s) failed`);
    process.exit(1);
  }

  console.log("\n✅ All tests passed!");
  process.exit(0);
}

main().catch((error) => {
  console.error("\n💥 Test suite crashed:", error);
  process.exit(1);
});
