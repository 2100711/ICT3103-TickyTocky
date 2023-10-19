import React, { useState } from 'react';
import { Modal, Form, Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCerts } from "../../api/certs";
import * as XLSX from 'xlsx'; // Import the xlsx library

export const ExcelUploadModal = ({ visible, onCancel }) => {
    const [fileData, setFileData] = useState([]);

    const handleFileUpload = async (info) => {
        const excelData = await readFileContents(info.fileList[0].originFileObj);
        setFileData(excelData)
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully`);
        //     console.log('hi')
        //     const excelData = await readFileContents(info.file.originFileObj);
        //     setFileData(excelData);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
    };

    const readFileContents = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                resolve(data);
            };

            reader.onerror = (error) => {
                console.error('File reading error:', error);
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const handleCustomRequest = async () => {
        if (fileData) {
            console.log('Data to be submitted:', fileData);
            const result = await createCerts(fileData)
            console.log('result',result)
            // Call the API to submit the data using the 'fileData'
        }
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
                        maxCount={1}
                        showUploadList={{ showRemoveIcon: true }}
                        accept=".xls, .xlsx"
                        beforeUpload={() => false}
                        onChange={(info) => handleFileUpload(info)}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
            <Button title="Submit" onClick={handleCustomRequest}>
                Submit
            </Button>
        </Modal>
    );
};
