import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tabs,
  Form,
  Input,
  Upload,
  DatePicker,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createCert, createCerts } from "../../api/certs";
import { getAllUsers } from "../../api/users";

const { TabPane } = Tabs;

export const CertForm = ({ visible, onCancel }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [userEmails, setUserEmails] = useState([]);

  useEffect(() => {
    // Fetch user emails from the server when the component mounts
    getAllUsers()
      .then((emails) => {
        setUserEmails(emails.emails);
      })
      .catch((error) => console.error("Error fetching user emails:", error));
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = async (values) => {
    try {
      const certificate = await createCert(values);
      // Handle the created certificate (e.g., display a success message)
      console.log("Certificate created:", certificate);
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error creating certificate:", error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const certs = await createCerts(file);
      // Handle the certs (e.g., display a success message)
      console.log("Certificates created:", certs);
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error creating certificates:", error);
    }
  };

  return (
    <Modal
      title="Certificate Form"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Single" key="single">
          <Form layout="vertical">
            <Form.Item
              label="User Email"
              name="user_email"
              rules={[
                { required: true, message: "Please select the user email" },
              ]}
            >
              <Select showSearch>
                {userEmails.map((email) => (
                  <Select.Option key={email} value={email}>
                    {email}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Validated By"
              name="validated_by"
              rules={[
                { required: true, message: "Please enter the validated by" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date of Validation"
              name="date_of_validation"
              rules={[
                {
                  required: true,
                  message: "Please enter the date of validation",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Watch ID"
              name="watch_id"
              rules={[{ required: true, message: "Please enter the watch ID" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Issue Date"
              name="issue_date"
              rules={[
                { required: true, message: "Please select the issue date" },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Expiry Date"
              name="expiry_date"
              rules={[
                { required: true, message: "Please select the expiry date" },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Remarks"
              name="remarks"
              rules={[{ required: true, message: "Please enter the remarks" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Multiple" key="multiple">
          <Upload
            name="file"
            customRequest={handleFileUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Click to Upload Excel</Button>
          </Upload>
        </TabPane>
      </Tabs>
    </Modal>
  );
};
