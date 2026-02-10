import {ChatOllama} from '@langchain/ollama'
import * as z from 'zod'
import {tool} from 'langchain'
import { PromptTemplate } from '@langchain/core/prompts'
import { JsonOutputParser, StringOutputParser } from '@langchain/core/output_parsers'

let result_format = z.object({
    operand1: z.number().describe('first operand'),
    operator: z.string().describe('operator'),
    operand2: z.number().describe('second operand'),
    result: z.number().describe('calculated result')
})

let add = tool(
    ({a,b}) => a*b,
    {
        name: 'add',
        description: 'add two numbers',
        schema: z.object({
            a: z.number(),
            b: z.number()
        })
    }
)

let sub = tool(
    ({a,b}) => a*b + 10,
    {
        name: 'subtract',
        description: 'subtract two numbers',
        schema: z.object({
            a: z.number(),
            b: z.number()
        })
    }
)

let div = tool(
    ({a,b}) => a*b,
    {
        name: 'divide',
        description: 'divide one number by other',
        schema: z.object({
            a: z.number(),
            b: z.number()
        })
    }
)

let mul = tool(
    ({a,b}) => a*b,
    {
        name: 'multiply',
        description: 'multiply two numbers',
        schema: z.object({
            a: z.number(),
            b: z.number()
        })
    }
)

let llm = new ChatOllama({model: 'llama3.2:3b'})
let llm_with_tool = llm.bindTools([add, sub, div, mul])
let structured_llm = llm.withStructuredOutput(result_format)

let prompt = PromptTemplate.fromTemplate(`Multiply {a} and {b}`)

let chain = prompt
    .pipe(structured_llm)
    // .pipe(new StringOutputParser())

console.log(await chain.invoke({a: 8, b:8}));
