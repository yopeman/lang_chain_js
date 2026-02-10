import {OllamaEmbeddings} from '@langchain/ollama'
import {MongoDBAtlasVectorSearch} from '@langchain/mongodb'
import {MongoClient} from 'mongodb'
import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'

let embeddings = new OllamaEmbeddings({model: 'embeddinggemma:300m'})
let client = new MongoClient('mongodb://localhost:27017')
await client.connect()

let collection = client.db('fsr_db').collection('documents')
let vector_store = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: 'vector_idx'
})

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

// let result = await embed_document('./docs/G9-Biology-STB-2023-web.pdf')
// if(result) console.log("Embedding Complete!")