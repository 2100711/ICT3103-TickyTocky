import React, { useState, useEffect } from "react";
import { Modal, Form, Button, message } from "antd";
import { createCerts } from "../../api/certs";
import * as XLSX from "xlsx";

export const ExcelUploadModal = ({ visible, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!visible) {
      // Reset form fields and feedback when the modal visibility changes
      setSelectedFile(null);
      setSuccessMessage(null);
      setSubmitting(false);
    }
  }, [visible]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFormSubmit = async () => {
    if (!selectedFile) {
      message.error("Please select an Excel file before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("excelFile", selectedFile);
      const fileData = await parseExcelFile(selectedFile);
      const customJsonData = transformData(fileData);

      const response = await createCerts(customJsonData);

      if (response.success) {
        setSuccessMessage("Certificates created successfully");
      } else {
        message.error("An error occurred while creating certificates");
      }
    } catch (error) {
      message.error("An error occurred while creating certificates");
    } finally {
      setSubmitting(false);
    }
  };

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        data.shift(); // Remove the header

        resolve(data);
      };

      reader.onerror = (error) => {
        console.error("File reading error:", error);
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const transformData = (data) => {
    const jsonData = [];

    for (let row of data) {
      jsonData.push({
        brand: row[0],
        model_no: row[1],
        model_name: row[2],
        movement: row[3],
        case_material: row[4],
        bracelet_strap_material: row[5],
        yop: row[6],
        gender: row[7],
        case_serial: row[8],
        movement_serial: row[9],
        dial: row[10],
        bracelet_strap: row[11],
        crown_pusher: row[12],
        user_email: row[13],
        validated_by: row[14],
        date_of_validation: row[15],
        issue_date: row[16],
        expiry_date: row[17],
        remarks: row[18],
      });
    }

    return jsonData;
  };

  return (
    <Modal
      title="Upload Excel File"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form>
        <Form.Item label="Select Excel File">
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Form.Item>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </Form>
    </Modal>
  );
};
