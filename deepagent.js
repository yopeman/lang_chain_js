import {ChatOllama} from '@langchain/ollama'
import {createDeepAgent} from 'deepagents'
import {createAgent} from 'langchain'
import { HumanMessage } from "@langchain/core/messages";
import {DuckDuckGoSearch} from '@langchain/community/tools/duckduckgo_search'

let llm = new ChatOllama({model: 'llama3.2:3b'})

let agent = createDeepAgent({
    model: llm,
    // tools: [new DuckDuckGoSearch()],
    systemPrompt: 'You are a helpful assistant'
})

response = await agent.invoke({
    messages: [
        new HumanMessage('How many people exist in the world currently?')
    ]
})
console.log(response);
