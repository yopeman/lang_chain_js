import pdfParse from "./pdf_wrapper.js";
import * as fs from "fs";

async function testPDFParsing() {
  try {
    console.log("Testing PDF parsing...");
    
    // Read and parse PDF
    const pdfBuffer = fs.readFileSync("../docs/final_year_project_documentation.pdf");
    const pdfData = await pdfParse(pdfBuffer);
    
    console.log("PDF parsed successfully!");
    console.log("PDF text length:", pdfData.text.length);
    
    // Show first 1000 characters to verify content
    console.log("First 1000 characters:");
    console.log(pdfData.text.substring(0, 1000));
    
    // Try to find Table of Contents
    const tocMatch = pdfData.text.match(/Table of Content([\s\S]{0,4000})/i);
    if (tocMatch) {
      console.log("\nFound Table of Contents:");
      console.log(tocMatch[0]);
    } else {
      console.log("\nTable of Contents not found in first part of text");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testPDFParsing();