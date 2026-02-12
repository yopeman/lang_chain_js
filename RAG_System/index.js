import {v4 as uuid4} from 'uuid'
import ConversationMemory from './conversation_memory.js'
import {ChatOllama, OllamaEmbeddings} from '@langchain/ollama'
import {PromptTemplate} from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import {FaissStore} from '@langchain/community/vectorstores/faiss'

let llm = new ChatOllama({model: 'llama3.2:3b'})
let embeddings = new OllamaEmbeddings({model: 'all-minilm:22m'})
let vector_store = await FaissStore.load('../docs/faiss_idx', embeddings)

let generate_response = async ({user_input, thread_id}) => {
    let memory = new ConversationMemory(thread_id)
    let standalone_question_prompt = PromptTemplate.fromTemplate(`
        Based on the following user input and conversational history (if any),
        remember that don't describe it.
        extract standalone question.
        * User input: {user_input}
        * History: {history}
        * Standalone question:
    `.trim())
    let standalone_question_chain = standalone_question_prompt
        .pipe(llm)
        .pipe(new StringOutputParser())
    let standalone_question = await standalone_question_chain.invoke({
        user_input,
        history: await memory.history()
    })

    let retriever = vector_store.asRetriever()
    let retrieved_docs = await retriever.invoke(standalone_question)
    let retrieved_text = retrieved_docs.map(doc => {
        // console.log(doc);
        
        let t = `${doc.pageContent}(Grade 9 Biology Book, Page - ${doc.metadata.loc.pageNumber})`
        // console.log(t);        
        return t
    })
    let context = retrieved_text.join('\n\n')

    let final_prompt = PromptTemplate.fromTemplate(`
        Based on the following context and conversational history (if any),
        answer user question.
        * Context: {context}
        * History: {history}
        * User question: {user_input}
        * Answer:
    `.trim())
    let final_chain = final_prompt
        .pipe(llm)
        .pipe(new StringOutputParser())
    let final_result = await final_chain.invoke({
        context,
        user_input,
        history: await memory.history()
    })
    await memory.save({role: 'User', content: user_input})
    await memory.save({role: 'AI', content: final_result})
    return final_result
}



let user_input = `
What is the difference between light and electron microscope
You must be cite your reference
ANSWER:
REFERENCE:
`.trim()
// let thread_id = uuid4()



let answer = await generate_response({user_input, thread_id: 'new-thread-3'})
console.log(answer);
