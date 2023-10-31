import React, { useState, useEffect } from "react";
import { Modal, Form, Button, notification, message } from "antd";
import { createCerts } from "../../api/certs";
import * as XLSX from "xlsx";
import { validateExcelData } from "../../utils/validation";

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
            return;
        }

        setSubmitting(true);

        try {
            const fileData = await parseExcelFile(selectedFile);

            if (fileData.length > 0) {
                const response = await createCerts(fileData);

                if (response.success) {
                    notification.success({
                        message: "Certificate Creation Successful",
                        description: "The certificates have been successfully created and are now available for viewing and download.",
                        duration: 5,
                    });
                } else {
                    notification.error({
                        message: "Certificate Creation Failed",
                        description: "An issue occurred while trying to create the certificates.",
                        duration: 5,
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: "Certificate Creation Failed",
                description: "An issue occurred while trying to create the certificates.",
                duration: 5,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const parseExcelFile = async (file) => {
        return new Promise(async (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        raw: false,
                    });

                    // Assuming the first row contains column headers (keys)
                    const headers = jsonData[0];
                    const jsonArray = jsonData.slice(1).map(row => {
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = row[index];
                        });
                        return obj;
                    });

                    const validationErrors = validateExcelData(jsonArray);

                    if (validationErrors.length === 0) {
                        resolve(jsonArray);
                    } else {
                        const uniqueValidationErrors = new Set(validationErrors);
                        const uniqueErrorsArray = Array.from(uniqueValidationErrors);
                        for (const uniqueError of uniqueErrorsArray) {
                            message.error({
                                content: uniqueError,
                                duration: 5,
                            });
                        }
                        reject(uniqueErrorsArray);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <Modal
      title="Upload Excel File"
      visible={visible}
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
      </Form>
    </Modal>
    );
};