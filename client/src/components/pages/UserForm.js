import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Switch,
  message,
  Spin,
} from "antd";
import { updateUserAsAdmin } from "../../api/users";

export const UserForm = ({ user, visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      role: user.role,
      account_lock: user.account_lock,
      email_verified: user.email_verified,
      f_name: user.f_name,
      l_name: user.l_name,
    });
  }, [form, user]);

  const handleCancel = () => {
    onCancel();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const response = await updateUserAsAdmin({
        email: user.email,
        ...values,
      });
      if (response.success) {
        message.success("Profile updated successfully.");
      } else {
        message.error("Failed to update profile. Please try again.");
      }
      setLoading(false);
      handleCancel();
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
      title="User Form"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Spin tip="Loading..." spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="First Name"
            name="f_name"
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
            name="l_name"
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
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role." }]}
          >
            <Select placeholder="Select a role">
              <Select.Option value="member">member</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Account Lock"
            name="account_lock"
            valuePropName="checked"
            rules={[
              { required: true, message: "Please select an account status." },
            ]}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Email Verified"
            name="email_verified"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Please select an email verification status.",
              },
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
