import {v4 as uuid4} from 'uuid'
import ConversationMemory from './conversation_memory.js'
import {ChatOllama} from '@langchain/ollama'
import {PromptTemplate} from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

let llm = new ChatOllama({model: 'llama3.2:3b'})
let generate_response = async ({user_input, thread_id}) => {
    // let memory = new ConversationMemory(thread_id)
    let standalone_question_prompt = PromptTemplate.fromTemplate(`
        Based on the following user input and conversational history (if any),
        extract standalone question.
        * User input: {user_input}
        * History: {history}
        * Standalone question:
    `.trim())
    let standalone_question_chain = standalone_question_prompt
        .pipe(llm)
        .pick(new StringOutputParser())
    let standalone_question = await standalone_question_chain.invoke({
        user_input,
        history: 'await memory.history()'
    })
    return standalone_question
}



let user_input = 'What is microscope?'
// let thread_id = uuid4()



let answer = await generate_response({user_input, thread_id: 'new-thread-1'})
console.log(answer);
