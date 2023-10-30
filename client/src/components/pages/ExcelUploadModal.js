import React, { useState, useEffect } from "react";
import { Modal, Form, Button, notification } from "antd";
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
      return;
    }

    setSubmitting(true);

    try {
      const fileData = await parseExcelFile(selectedFile);
      const customJsonData = await transformData(fileData);

      if (customJsonData.length > 0) {
        const response = await createCerts(customJsonData);

        if (response.success) {
          notification.success({
            message: "Certificate Creation Successful",
            description:
              "The certificates have been successfully created and are now available for viewing and download. Thank you for using our services.",
            duration: 5,
          });
        } else {
          notification.error({
            message: "Certificate Creation Failed",
            description:
              "We encountered an issue while trying to create the certificates. Please try again later or contact our support team for assistance.",
            duration: 5,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Certificate Creation Failed",
        description:
          "We apologize, but we encountered an issue while trying to create the certificates. Please try again later or contact our support team for assistance.",
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
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        jsonData.shift(); // Remove the header
        resolve(jsonData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const transformData = async (data) => {
    const jsonData = [];

    if (data.length === 0) {
      notification.error({
        message: "Certificates Creation Failed",
        description: "The data is empty.",
        duration: 5,
      });
      return jsonData;
    }

    for (let row of data) {
      const validated = validateCert(...row);
      if (validated.length > 0) {
        notification.error({
          message: "Certificates Creation Failed",
          description: validated.join(", "),
          duration: 5,
        });
        return [];
      }

      const [
        case_serial,
        movement_serial,
        dial,
        bracelet_strap,
        crown_pusher,
        brand,
        model_no,
        model_name,
        movement,
        case_material,
        bracelet_strap_material,
        yop,
        gender,
        user_email,
        validated_by,
        date_of_validation,
        issue_date,
        expiry_date,
        remarks,
      ] = row;

      jsonData.push({
        case_serial,
        movement_serial,
        dial,
        bracelet_strap,
        crown_pusher,
        brand,
        model_no,
        model_name,
        movement,
        case_material,
        bracelet_strap_material,
        yop,
        gender,
        user_email,
        validated_by,
        date_of_validation,
        issue_date,
        expiry_date,
        remarks,
      });
    }

    return jsonData;
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
