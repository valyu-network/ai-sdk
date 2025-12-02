import dotenv from "dotenv";
import { streamText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { patentSearch } from "@valyu/ai-sdk";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("⚖️ Patent Search Example\n");

  const prompt = "Find patents published in 2025 for high energy laser weapon systems";
  console.log("📝 Prompt:", prompt);
  console.log("\n");

  const result = streamText({
    model: openai("gpt-5"),
    system: "You are a helpful assistant. Make ONE search with a concise query, then provide a detailed answer based on the search results.",
    messages: [{ role: "user", content: prompt }],
    tools: {
      patentSearch: patentSearch({ maxNumResults: 2 }),
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.fullStream) {
    if (chunk.type === "text-delta" && chunk.text) {
      process.stdout.write(chunk.text);
    } else if (chunk.type === "tool-call") {
      console.log(`\n\n⚖️ Searching: "${chunk.input.query}"\n`);
    }
  }

  console.log("\n\n✅ Done!");
}

main().catch(console.error);
