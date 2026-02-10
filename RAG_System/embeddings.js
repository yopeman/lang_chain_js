import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
import {vector_store} from './config.js'

let embed_document = async (pdf_filepath) => {
    let loader = new PDFLoader(pdf_filepath)
    let docs = await loader.load()

    let splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50
    })

    let splitted_docs = await splitter.splitDocuments(docs)
    await vector_store.addDocuments(splitted_docs)
    return true
}

let result = await embed_document('../docs/G9-Biology-STB-2023-web.pdf')
if(result) console.log("Embedding Complete!")