import React, { useState } from "react";
import { Modal, Button, Tabs, Form, Input, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CertForm } from "./CertForm";
import { getAllCerts } from "../../api/certs";
import { CertTable } from "../pages/CertTable";
import { ExcelUploadModal } from "../pages/ExcelUploadModal";

export const CertsManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [excelUploadModalVisible, setExcelUploadModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const showExcelUploadModal = () => {
    setExcelUploadModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setExcelUploadModalVisible(false);
  };

  return (
    <div>
      <ExcelUploadModal
        visible={excelUploadModalVisible}
        onCancel={handleCancel}
      />
      <CertForm visible={modalVisible} onCancel={handleCancel} />
      <CertTable role="admin" />
      <Button type="primary" onClick={showModal}>
        Create New Certification
      </Button>
      <Button type="primary" onClick={showExcelUploadModal}>
        Bulk Upload Certifications
      </Button>
    </div>
  );
};
