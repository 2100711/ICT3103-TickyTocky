import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, DatePicker, Upload, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

export const CertForm = ({ visible, onCancel }) => {
    const [activeTab, setActiveTab] = useState("serial");

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleNext = () => {
        // Handle the next button logic, e.g., validate and move to the next tab
    };

    const handlePrevious = () => {
        // Handle the previous button logic, e.g., move back to the previous tab
    };

    const handleFinish = (values) => {
        // Handle the form submission when all steps are completed
        console.log("Submitted values:", values);
    };

    return (
        <Modal
      title="Certificate Form"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Serial Number Form" key="serial">
          <Form
            layout="vertical"
            onFinish={handleNext}
          >
            {/* Serial Number Form Fields */}
            {/* Include the specified fields for the Serial Number Form */}
            <Form.Item label="Case" name="case" rules={[{ required: true, message: "Please enter the case" }]}>
              <Input />
            </Form.Item>
            {/* Add more fields for the Serial Number Form */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Watch Form" key="watch">
          <Form
            layout="vertical"
            onFinish={handleNext}
          >
            {/* Watch Form Fields */}
            {/* Include the specified fields for the Watch Form */}
            <Form.Item label="Brand" name="brand" rules={[{ required: true, message: "Please enter the brand" }]}>
              <Input />
            </Form.Item>
            {/* Add more fields for the Watch Form */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
              <Button onClick={handlePrevious}>Previous</Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Cert Form" key="cert">
          <Form
            layout="vertical"
            onFinish={handleFinish}
          >
            {/* Cert Form Fields */}
            {/* Include the specified fields for the Cert Form */}
            <Form.Item label="User Email" name="user_email" rules={[{ required: true, message: "Please select the user email" }]}>
              <Select showSearch>
                {/* Map user emails */}
              </Select>
            </Form.Item>
            {/* Add more fields for the Cert Form */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handlePrevious}>Previous</Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
    );
};