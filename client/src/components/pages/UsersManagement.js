import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tabs,
  Form,
  Input,
  Upload,
  DatePicker,
  Spin,
  Switch,
  Select,
  message,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { UsersTable } from "./UsersTable";
import { createUser } from "../../api/users";

// NOTE: create user here

export const UsersManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [reFetchUsers, setReFetchUsers] = useState(false);

  const showCreateModal = () => {
    setCreateModalVisible(true);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setCreateModalVisible(false);
  };

  return (
    <>
      <UsersTable
        showModal={showModal}
        visible={modalVisible}
        onCancel={handleCancel}
        reFetchUsers={reFetchUsers}
        setReFetchUsers={setReFetchUsers}
      />
      <Button type="primary" title="Create User" onClick={showCreateModal}>
        Create User
      </Button>
      <CreateUserForm
        visible={createModalVisible}
        onCancel={handleCancel}
        setReFetchUsers={setReFetchUsers}
      />
    </>
  );
};

const CreateUserForm = ({ visible, onCancel, setReFetchUsers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldValue({
      create_f_name: "",
      create_l_name: "",
      create_email: "",
      create_password: "",
      create_cfmPassword: "",
      create_account_lock: false,
      create_role: "member",
    });
  }, [form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const response = await createUser({
        f_name: values.create_f_name,
        l_name: values.create_l_name,
        email: values.create_email,
        password: values.create_password,
        account_lock: values.create_account_lock,
        role: values.create_role,
      });

      if (response.success) {
        message.success("User created successfully");
        form.resetFields();
        setReFetchUsers(true);
      } else {
        message.error("Failed to create user. Please try again.");
      }
      setLoading(false);
      onCancel();
    } catch (error) {
      setLoading(false);
      message.error(
        "An error occurred. Please check your input and try again."
      );
    }
  };

  return (
    <Modal
      forceRender
      title="Create User Form"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin tip="Loading..." spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="First Name"
            name="create_f_name"
            rules={[
              { required: true, message: "First Name is required" },
              {
                pattern: /^[A-Za-z\s-']{2,50}$/,
                message:
                  "First name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="create_l_name"
            rules={[
              { required: true, message: "Last name is required" },
              {
                pattern: /^[A-Za-z\s-']{2,50}$/,
                message:
                  "Last name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item
            name="create_email"
            rules={[
              { required: true, message: "Email is required" },
              {
                pattern: /^[a-z0-9.]{6,30}@gmail\.com$/,
                message: "Only Gmail addresses are allowed",
              },
            ]}
          >
            <Input
              className="input-box"
              placeholder="Enter your email"
              prefix={<MailOutlined />} // Icon for email
            />
          </Form.Item>
          <Form.Item
            name="create_password"
            rules={[
              { required: true, message: "Password is required" },
              {
                pattern:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#%^&+=])(?!.*\s).{14,128}$/,
                message:
                  "Password must be at least 14 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&+=).",
              },
            ]}
          >
            <Input.Password
              className="input-box"
              placeholder="Enter your password"
              prefix={<LockOutlined />} // Icon for password
            />
          </Form.Item>
          <Form.Item
            name="create_cfmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please re-enter the same password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("create_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              className="input-box"
              placeholder="Reenter your password"
              prefix={<LockOutlined />} // Icon for confirm password
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="create_role"
            rules={[{ required: true, message: "Please select a role." }]}
          >
            <Select placeholder="Select a role">
              <Select.Option value="member">member</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Account Lock"
            name="create_account_lock"
            valuePropName="checked"
            rules={[
              { required: true, message: "Please select an account status." },
            ]}
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
