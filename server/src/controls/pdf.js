import { PDFDocument, rgb } from 'pdf-lib';
import { CertModel } from '../models/Certs.js';

async function createPdfContent(data) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page
    const page = pdfDoc.addPage([600, 400]);

    // Add content to the page
    const { width, height } = page.getSize();
    const fontSize = 30;
    const text = 'Certificate of Validation';

    page.drawText(text, {
        x: 50,
        y: height - 50,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    // Add certificate data
    const certData = `
        User Email: ${data.user_email}
        Validated By: ${data.validated_by}
        Date of Validation: ${data.date_of_validation}
        Watch ID: ${data.watch_id}
        Issue Date: ${data.issue_date}
        Expiry Date: ${data.expiry_date}
        Remarks: ${data.remarks}
    `;

    page.drawText(certData, {
        x: 50,
        y: height - 150,
        size: 14,
        color: rgb(0, 0, 0),
    });

    // Serialize the PDF to a byte array
    const pdfBytes = await pdfDoc.save();

    // Convert the byte array to a base64 string
    const pdfContent = Buffer.from(pdfBytes).toString('base64');

    return pdfContent;
}

export { createPdfContent }