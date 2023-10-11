import React, { useState } from 'react';
import { Modal, Button, Tabs, Form, Input, Upload, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CertForm } from './CertForm';

export const Admin = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <div>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <CertForm visible={modalVisible} onCancel={handleCancel} />
    </div>
    );
};