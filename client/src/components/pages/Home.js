import React, { useState } from "react";
import { Input, notification } from "antd";
import { Document, Page, pdfjs } from "react-pdf"; // Import react-pdf components
import "../styles/Home.css";
import { getCert } from "../../api/certs";

export const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const [certificate, setCertificate] = useState(null);
    const [pdfData, setPdfData] = useState(null); // State for decoded PDF data

    // Set up the worker source
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js';

    const handleSearch = async (e) => {
        e.preventDefault();
        await getCert(searchInput).then((response) => {
            if (response.success) {
                notification.success({
                    message: "Certification Found",
                    description: "Certificate is valid",
                    duration: 5,
                });
                setCertificate(response.certificate);
                // Decode and set the PDF data
                setPdfData(atob(response.pdf_content));
            } else {
                notification.error({
                    message: "Certification Not Found",
                    description: "Certificate is invalid",
                    duration: 5,
                });
                setCertificate(null);
                setPdfData(null);
            }
        });
    };

    return (
        <div className="home">
            <div className="search-bar">
                <Input
                    placeholder="Search..."
                    className="search-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onPressEnter={handleSearch}
                    allowClear
                />
                
            </div>
            <div className="certificate-info">
                    {certificate ? (
                        <div>
                            <h3>Certificate Information</h3>
                            <p>Name: {certificate.name}</p>
                            <p>Issuer: {certificate.issuer}</p>
                            <p>Issue Date: {certificate.issueDate}</p>
                        </div>
                    ) : (
                        <p>No certificate found.</p>
                    )}
                </div>
                {pdfData && (
                    <div className="pdf-viewer">
                        <Document
                            file={{ data: pdfData }}
                            options={{ workerSrc: pdfjs.GlobalWorkerOptions.workerSrc }}
                        >
                            <Page pageNumber={1} />
                        </Document>
                    </div>
                )}
        </div>
    );
};