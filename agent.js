import { createAgent, tool, initChatModel } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import * as z from "zod";
import { randomUUID } from "crypto";
import {PostgresSaver} from '@langchain/langgraph-checkpoint-postgres'


const systemPrompt = `
You are an expert mathematics assistant.

Rules:
- Use the calculator tool for ALL mathematical computations.
- For non-math questions, answer normally.
- Always return structured output.
`.trim();

const calculator = tool(
  async ({ expression }) => {
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new Error("Invalid mathematical expression.");
      }

      const result = eval(expression)

      return String(result);
    } catch (err) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "calculator",
    description: "Evaluate valid mathematical expressions safely.",
    schema: z.object({
      expression: z.string().describe("A valid mathematical expression."),
    }),
  }
);

const model = await initChatModel("llama3.2:3b", {
  modelProvider: "ollama",
  temperature: 0,
});

const responseFormat = z.object({
  answer: z.string().describe("Final answer to the user"),
});

const checkpointer = new MemorySaver();
// const DB_URL = 'postgressql://root:12345678@localhost:5432/lang_chain_db?sslmode=disable'
// const checkpointer = PostgresSaver.fromConnString(DB_URL)
// await checkpointer.setup()

function createMathAgent() {
  return createAgent({
    model,
    systemPrompt,
    tools: [calculator],
    responseFormat,
    checkpointer,
  });
}

const agent = createMathAgent();

const config = {
  configurable: {
    thread_id: randomUUID(),
  },
};


const response = await agent.invoke({
    messages: [
        new HumanMessage("What is 25 * (4 + 3)?"),
    ]},
    config
);

console.log("Structured Answer:", response.structuredResponse?.answer);
