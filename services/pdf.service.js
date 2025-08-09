import PDFDocument from 'pdfkit'
import fs from 'fs'
import { bugService } from './bug.service.js';
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')

function createPdf() {

    //   return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream('output.pdf');

    doc.pipe(writeStream);

    doc
        .fontSize(25)
        .text('Some text with an embedded font!', 100, 100);



    // const bugs = utilService.readJsonFile('data/bug.json')

    doc
        .addPage()
        .fontSize(14)
        .text(JSON.stringify(bugs, null, 2), 100, 100);
    doc.end();

}

export const pdfService = {
    createPdf
}