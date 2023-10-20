import { PDFDocument, rgb, radians } from "pdf-lib";
import { CertModel } from "../models/Certs.js";
import fs from "fs";

async function createPdfContent(data) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page
  const page = pdfDoc.addPage([600, 400]);

  const watermarkImageBytes = await fetchWatermarkImage();

  // Add content to the page
  const { width, height } = page.getSize();
  const fontSize = 30;
  const text = "Certificate of Validation";

  page.drawText(text, {
    x: 50,
    y: height - 50,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  // Add certificate data
  const certData = `
        Certificate ID: ${data.cert_id}
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

  // Add watermark text
  const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
  const imageWidth = 200; // Adjust the width of the image as needed
  const imageHeight = 100; // Adjust the height of the image as needed
  const imageX = width / 2 - imageWidth / 2;
  const imageY = height / 2 - imageHeight / 2;

  page.drawImage(watermarkImage, {
    x: imageX,
    y: imageY,
    width: imageWidth,
    height: imageHeight,
    opacity: 0.5, // Adjust opacity as needed
    rotate: radians(45), // Rotate by 45 degrees
  });

  // Serialize the PDF to a byte array
  const pdfBytes = await pdfDoc.save();

  // Convert the byte array to a base64 string
  const pdfContent = Buffer.from(pdfBytes).toString("base64");

  return pdfContent;
}

// async function createPdfContents(dataArray) {
//     const pdfContents = [];

//     const watermarkImageBytes = await fetchWatermarkImage();

//     for (const data of dataArray) {
//         const pdfDoc = await PDFDocument.create();
//         const page = pdfDoc.addPage([600, 400]);

//         // Add content to the page
//         const { width, height } = page.getSize();
//         const fontSize = 30;
//         const text = "Certificate of Validation";

//         page.drawText(text, {
//             x: 50,
//             y: height - 50,
//             size: fontSize,
//             color: rgb(0, 0, 0),
//         });

//         // Add certificate data for this entry
//         const certData = `
//             Certificate ID: ${data.cert_id}
//             User Email: ${data.user_email}
//             Validated By: ${data.validated_by}
//             Date of Validation: ${data.date_of_validation}
//             Watch ID: ${data.watch_id}
//             Issue Date: ${data.issue_date}
//             Expiry Date: ${data.expiry_date}
//             Remarks: ${data.remarks}
//         `;

//         page.drawText(certData, {
//             x: 50,
//             y: height - 150,
//             size: 14,
//             color: rgb(0, 0, 0),
//         });

//         // Add watermark text
//         const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
//         const imageWidth = 200; // Adjust the width of the image as needed
//         const imageHeight = 100; // Adjust the height of the image as needed
//         const imageX = width / 2 - imageWidth / 2;
//         const imageY = height / 2 - imageHeight / 2;

//         page.drawImage(watermarkImage, {
//             x: imageX,
//             y: imageY,
//             width: imageWidth,
//             height: imageHeight,
//             opacity: 0.5, // Adjust opacity as needed
//             rotate: radians(45), // Rotate by 45 degrees
//         });

//         // Serialize the PDF to a byte array
//         const pdfBytes = await pdfDoc.save();

//         // Convert the byte array to a base64 string and add it to the pdfContents array
//         pdfContents.push(Buffer.from(pdfBytes).toString("base64"));
//     }

//     return pdfContents;
// }

async function fetchWatermarkImage() {
  // Read the image file from a local path
  const imageBytes = fs.readFileSync("../server/src/img/logo.png");
  return new Uint8Array(imageBytes);
}

export { createPdfContent };
