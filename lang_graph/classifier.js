import {StateGraph, START, END} from '@langchain/langgraph'
import {ChatOllama} from '@langchain/ollama'
import * as z from 'zod'
import {PromptTemplate} from '@langchain/core/prompts'

let llm = new ChatOllama({model: 'smollm2:135m'})


let State = z.object({
    input: z.string(),
    classification: z.enum(['yes', 'no']),
    response: z.string()
})

let classifier_output_format = z.object({
    answer: z.enum(['yes', 'no'])
})

let classifier_node = async (state) => {
    let prompt = PromptTemplate.fromTemplate('Is this a question? Answer "yes" or "no":\n\n{input}')
    let structured_llm = llm.withStructuredOutput(classifier_output_format)
    let chain = prompt.pipe(structured_llm)
    let response = await chain.invoke({input: state.input})

    return {
        classification: response.answer.toLowerCase()
    }
}

let route = (state) => {
    return state.classification
}

let answer_node = async (state) => {
    let response = await llm.invoke(state.input)
    return {
        response: response.content
    }
}

let default_response_node = async (state) => {
    return {
        response: "This doesn't look like a question.",
    }
}

let workflow = new StateGraph(State)
const CLASSIFIER = 'classifier'
const ANSWER = 'answer'
const DEFAULT = 'default'

workflow.addNode(CLASSIFIER, classifier_node)
workflow.addNode(ANSWER, answer_node)
workflow.addNode(DEFAULT, default_response_node)

workflow.addEdge(START, CLASSIFIER)
workflow.addConditionalEdges(
    CLASSIFIER,
    route,
    {
        yes: ANSWER,
        no: DEFAULT
    }
)
workflow.addEdge(ANSWER, END)
workflow.addEdge(DEFAULT, END)

let app = workflow.compile()
let result = await app.invoke({
    input: 'What is robot?'
})
console.log(result);


// import fs from 'fs/promises'
// let graph = await app.getGraphAsync()
// let blob = await graph.drawMermaidPng()
// let arrayBuffer = await blob.arrayBuffer()
// let buffer = Buffer.from(arrayBuffer)
// await fs.writeFile('./classifier.png', buffer)