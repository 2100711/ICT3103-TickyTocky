import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import { getCert } from "../../api/certs";

import "../styles/Home.css";

export const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  // Set up the worker source
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js";

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchInput) {
      notification.error({
        message: "Invalid Input",
        description: "Please enter a certification ID to search.",
        duration: 5,
      });
      return;
    } else {
      try {
        const response = await getCert(searchInput);
        if (response.success) {
          setCertificate(response.cert);
          // Decode and set the PDF data
          setPdfData(response.pdf_content);
        }
      } catch (error) {
        setCertificate(null);
        setPdfData(atob(null));
        notification.error({
          message: "Certification Not Found",
          description:
            "Please double confirm if the certification ID is correct.",
          duration: 5,
        });
      }
    }
  };

  const viewPDF = () => {
    const pdfWindow = window.open(``, "_blank", "height=1000,width=800");

    if (!pdfWindow) {
      alert("Please allow pop-ups for this website");
    }

    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
        encodeURI(pdfData) +
        "'></iframe>"
    );
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
      <div className="cert-info">
        {searchInput && certificate ? (
          <div>
            <h3>Certificate Information</h3>
            <p>Certificate ID: {certificate.cert_id}</p>
            <p>Issuer: {certificate.validated_by}</p>
            <p>Issue Date: {certificate.issue_date}</p>
            <Button type="primary" onClick={viewPDF}>
              View Certificate
            </Button>
          </div>
        ) : searchInput && !certificate ? (
          <p>No certificate found.</p>
        ) : null}
      </div>
    </div>
  );
};
