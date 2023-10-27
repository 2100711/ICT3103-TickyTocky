import { PDFDocument, rgb, radians } from "pdf-lib";
import fs from "fs/promises"; // Use the promise-based fs module

async function createPdfContent(data) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);

    const watermarkImageBytes = await fetchWatermarkImage();

    const { width, height } = page.getSize();

    const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
    const imageWidth = 550;
    const imageHeight = 250;
    const imageX = width / 2 - imageWidth / 2;
    const imageY = height - imageHeight;

    page.drawImage(watermarkImage, {
        x: imageX,
        y: imageY,
        width: imageWidth,
        height: imageHeight,
        opacity: 0.1,
    });

    const fontSize = 30;
    const text = "Certificate of Validation";

    page.drawText(text, {
        x: 50,
        y: height - 100,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    // Format date and other data as needed
    const dovDate = new Date(data.date_of_validation);
    const dovFormattedDate = dovDate.toISOString().slice(0, 10);

    // Create an array of lines for the certificate content
    const lines = [
        { text: "Certificate Details", isBold: true },
        `Certificate ID: ${data.cert_id}`,
        `Email: ${data.user_email}`,
        `Validated By: ${data.validated_by}`,
        `Date of Validation: ${data.date_of_validation}`,
        `Issue Date: ${data.issue_date}`,
        `Expiry Date: ${data.expiry_date}`,
        `Remarks: ${data.remarks}`,
        { text: "Watch Details", isBold: true },
        `Brand: ${data.watch_id.brand}`,
        `Model Numbers: ${data.watch_id.model_no}`,
        `Model Name: ${data.watch_id.model_name}`,
        `Movement: ${data.watch_id.movement}`,
        `Case Material: ${data.watch_id.case_material}`,
        `Bracelet/Strap Material: ${data.watch_id.bracelet_strap_material}`,
        `Year of Production: ${data.watch_id.yop}`,
        `Gender: ${data.watch_id.gender}`,
        { text: "Serial Number Details", isBold: true },
        `Case Serial Numbers: ${data.watch_id.serial_id.case_serial}`,
        `Model Numbers: ${data.watch_id.serial_id.movement_serial}`,
        `Model Name: ${data.watch_id.serial_id.dial}`,
        `Movement: ${data.watch_id.serial_id.bracelet_strap}`,
        `Case Material: ${data.watch_id.serial_id.crown_pusher}`,
    ];

    // Loop through lines and add to the page
    let startY = height - 150;
    for (const line of lines) {
        if (typeof line === "string") {
            page.drawText(line, { x: 50, y: startY, size: 14, color: rgb(0, 0, 0) });
        } else if (line.isBold) {
            page.drawText(line.text, {
                x: 50,
                y: startY,
                size: 14,
                font: await pdfDoc.embedFont("Helvetica-Bold"),
                color: rgb(0, 0, 0),
            });
        }
        startY -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString("base64");
}

async function fetchWatermarkImage() {
    try {
        // Read the image file from a local path
        const imageBytes = await fs.readFile("../server/src/img/logo.png");
        return new Uint8Array(imageBytes);
    } catch (error) {
        console.error("Error reading watermark image:", error);
        throw error; // Re-throw the error for higher-level error handling
    }
}

export { createPdfContent };