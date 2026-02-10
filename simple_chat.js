import {ChatOllama} from '@langchain/ollama'

let llm = new ChatOllama({model: 'smollm2:135m'})

let response = await llm.invoke("What is computer?")
console.log(response.content);
