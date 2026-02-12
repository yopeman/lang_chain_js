import { readFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';

async function splitAndExtract(pdfPath) {
    const existingPdfBytes = readFileSync(pdfPath);
    const srcDoc = await PDFDocument.load(existingPdfBytes);
    const pageCount = srcDoc.getPageCount();
    
    const results = [];

    for (let i = 0; i < pageCount; i++) {
        const subDoc = await PDFDocument.create();
        const [copiedPage] = await subDoc.copyPages(srcDoc, [i]);
        subDoc.addPage(copiedPage);
        const subDocBytes = await subDoc.save();
        const data = await pdfParse(subDocBytes);
        const pageText = data.text.trim();
        
        results.push({
            physicalPage: i + 1,
            content: pageText.length > 0 ? pageText : ""
        });
    }

    return results;
}

export default splitAndExtract