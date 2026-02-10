import { ChatOllama } from '@langchain/ollama'
import * as z from 'zod'

const personal_info = z.object({
  username: z.string(),
  email: z.string(),
  age: z.number(),
})

const llm = new ChatOllama({model: 'smollm2:135m'})

const structured_llm = llm.withStructuredOutput(personal_info)

const response = await structured_llm.invoke(`
Extract the following information and return it exactly as the schema requires.

My name is Yope Man, and my email is yopeman318@gmail.com. I'm 22 years old.
`.trim())

console.log(response)
