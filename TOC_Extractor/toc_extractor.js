import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as fs from "fs";
import pdfParse from "./pdf_wrapper.js";

// Initialize the LLM
const llm = new ChatOllama({model: "llama3.2:3b"});

// Function to extract TOC using structured output
async function extractTOCFromPDF(pdfPath) {
  try {
    // 1. Read and parse PDF
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    // 2. Create a system prompt for structured extraction
    const systemPrompt = `You are an expert at extracting structured information from textbooks. 
    Extract the Table of Contents from the provided textbook content and return it in a specific JSON format.

    JSON Structure:
    {
      "textbook": "string",
      "year": "number",
      "publisher": "string",
      "units": [
        {
          "unitNumber": "number",
          "unitTitle": "string",
          "pages": "string",
          "sections": [
            {
              "sectionNumber": "string",
              "sectionTitle": "string",
              "page": "number",
              "subsections": [
                {
                  "subsectionNumber": "string",
                  "subsectionTitle": "string",
                  "page": "number"
                }
              ]
            }
          ]
        }
      ]
    }

    Extract ONLY the Table of Contents. Ignore exercises, activities, and other content.
    Be precise with page numbers and hierarchical structure.`;

    // 3. Extract first few pages containing TOC
    // Usually TOC is in the beginning, so limit tokens
    const tocPages = pdfText.split(/===== Page \d+ =====/).slice(0, 10).join("\n");

    // 4. Call LLM with structured output request
    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Extract the Table of Contents from this textbook:\n\n${tocPages}`)
    ]);

    // 5. Parse the JSON response
    const tocJson = JSON.parse(response.content);
    return tocJson;

  } catch (error) {
    console.error("Error extracting TOC:", error);
    throw error;
  }
}

// Usage
const pdfPath = "./docs/G9-Biology-STB-2023-web.pdf";
extractTOCFromPDF(pdfPath)
  .then(toc => {
    console.log(JSON.stringify(toc, null, 2));
    fs.writeFileSync("toc.json", JSON.stringify(toc, null, 2));
  })
  .catch(console.error);