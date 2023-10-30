import React, { useState, useEffect } from "react";
import { Modal, Form, Button, message, notification } from "antd";
import { createCerts } from "../../api/certs";
import * as XLSX from "xlsx";
import { validateCert } from "../../utils/validation";

export const ExcelUploadModal = ({ visible, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!visible) {
            // Reset form fields and feedback when the modal visibility changes
            setSelectedFile(null);
            setSubmitting(false);
        }
    }, [visible]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleFormSubmit = async () => {
        if (!selectedFile) {
            notification.error({
                message: "Excel file is required",
                description: "Please select an Excel file before submitting.",
                duration: 5,
            });
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("excelFile", selectedFile);
            const fileData = await parseExcelFile(selectedFile);
            const customJsonData = transformData(fileData);

            const response = await createCerts(customJsonData);
            notification.success({
                message: "Certificate Creation Successful",
                description: "The certificates have been successfully created and is now available for viewing and download. Thank you for using our services.",
                duration: 5,
            });
        } catch (error) {
            notification.error({
                message: "Certificate Creation Failed",
                description: "We apologize, but we encountered an issue while trying to create the certificates. Please try again later or contact our support team for assistance.",
                duration: 5,
            });
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
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const transformData = (data) => {
        const jsonData = [];

        for (let row of data) {
            validateCert(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[17], row[18]);
            jsonData.push({
                case_serial: row[0],
                movement_serial: row[1],
                dial: row[2],
                bracelet_strap: row[3],
                crown_pusher: row[4],
                brand: row[5],
                model_no: row[6],
                model_name: row[7],
                movement: row[8],
                case_material: row[9],
                bracelet_strap_material: row[10],
                yop: row[11],
                gender: row[12],
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