import React, { useState } from 'react';
import { Modal, Form, Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCerts } from "../../api/certs";
import * as XLSX from 'xlsx'; // Import the xlsx library

export const ExcelUploadModal = ({ visible, onCancel }) => {
    const handleFileUpload = async (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);

            // Process the uploaded Excel file using XLSX library
            const fileData = await readFileContents(info.file.originFileObj);

            // You can now work with the 'fileData' Excel data
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };


    const readFileContents = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Log the start of the file reading
            console.log('Reading file...');

            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Log the data read from the file
                console.log('File data:', data);

                resolve(data);
            };

            reader.onerror = (error) => {
                // Log any errors that occur during file reading
                console.error('File reading error:', error);
                reject(error);
            };

            // Log when the file reading starts
            console.log('Reading file contents...');
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
                <Form.Item
                    name="file"
                    label="Select Excel File"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                >
                    <Upload
                        name="file"
                        action={(file) => createCerts(file)}
                        onChange={handleFileUpload}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};