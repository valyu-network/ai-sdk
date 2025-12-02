import dotenv from "dotenv";
import { streamText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { companyResearch } from "@valyu/ai-sdk";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("🏢 Company Research Example\n");

  const prompt = "Research Apple Inc and provide a comprehensive report";
  console.log("📝 Prompt:", prompt);
  console.log("\n");

  const result = streamText({
    model: openai("gpt-5"),
    system: "You are a helpful assistant. When researching companies, provide a detailed report based on the company information.",
    messages: [{ role: "user", content: prompt }],
    tools: {
      companyResearch: companyResearch(),
    },
    stopWhen: stepCountIs(5),
  });

  for await (const chunk of result.fullStream) {
    if (chunk.type === "text-delta" && chunk.text) {
      process.stdout.write(chunk.text);
    } else if (chunk.type === "tool-call") {
      console.log(`\n\n🏢 Researching: "${chunk.input.company}"\n`);
    }
  }

  console.log("\n\n✅ Done!");
}

main().catch(console.error);
