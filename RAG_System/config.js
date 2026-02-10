import {OllamaEmbeddings} from '@langchain/ollama'
import {MongoDBAtlasVectorSearch} from '@langchain/mongodb'
import {MongoClient} from 'mongodb'

let embeddings = new OllamaEmbeddings({model: 'embeddinggemma:300m'})
let client = new MongoClient('mongodb://localhost:27017')
await client.connect()

let collection = client.db('fsr_db').collection('documents')
let vector_store = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: 'vector_idx',
    textKey: "text",
    embeddingKey: "embedding",
})

// let info = await vector_store.similaritySearch("Microscope")
// console.log(info);


export {
    embeddings,
    collection,
    vector_store
}