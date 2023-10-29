import React, { useState } from "react";
import { Modal, Button, Tabs, Form, Input, Upload, DatePicker } from "antd";
import { UsersTable } from "./UsersTable";

// NOTE: create user here

export const UsersManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <UsersTable
      showModal={showModal}
      visible={modalVisible}
      onCancel={handleCancel}
    />
  );
};
