import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons"; // Import icons
import "../styles/Register.css";
import { register } from "../../api/auth";
import { getCsrfTokenFromAPI } from "../../api/auth";
import { AuthData } from "../../auth/AuthWrapper";

export const Register = () => {
  const navigate = useNavigate();
  const { login, user } = AuthData();
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if the user is already authenticated, and if so, redirect to another page.
    if (user.isAuthenticated) {
      navigate("/"); // Change the destination URL as needed.
    } else {
      getCsrfTokenFromAPI();
    }
  }, [user.isAuthenticated, navigate]);

  if (user.isAuthenticated) {
    return null; // Return null to prevent rendering the login page.
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await register(values);
      if (response.success) {
        notification.success({
          message: "Registration successful",
          description: "You may now login with your credentials",
          duration: 5,
        });
        navigate("/login");
      }
    } catch (error) {
      notification.error({
        message: "Registration failed",
        description: "An error occurred during registration",
        duration: 5,
      });
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <Form form={form} onFinish={handleSubmit} className="register-form">
        <h2>Register</h2>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            {
              pattern: /^[a-zA-Z0-9._%+-]{1,64}@gmail\.com$/,
              message: "Only Gmail addresses are allowed",
            },
          ]}
          className="form-item"
        >
          <Input
            className="input-box"
            placeholder="Enter your email"
            prefix={<MailOutlined />} // Icon for email
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+).{12,64}$/,
              message:
                "Password must be 12-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (e.g., !, @, #, $, %).",
            },
          ]}
          className="form-item"
        >
          <Input.Password
            className="input-box"
            placeholder="Enter your password"
            prefix={<LockOutlined />} // Icon for password
          />
        </Form.Item>
        <Form.Item
          name="cfmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please re-enter the same password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
          className="form-item"
        >
          <Input.Password
            className="input-box"
            placeholder="Reenter your password"
            prefix={<LockOutlined />} // Icon for confirm password
          />
        </Form.Item>
        <Form.Item
          name="f_name"
          rules={[
            { required: true, message: "First name is required" },
            {
              pattern: /^[A-Za-z\s-']{2,50}$/,
              message:
                "First name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
            },
          ]}
          className="form-item"
        >
          <Input
            className="input-box"
            placeholder="Enter your first name"
            prefix={<UserOutlined />}
            maxLength={50} // Icon for first name
          />
        </Form.Item>
        <Form.Item
          name="l_name"
          rules={[
            { required: true, message: "Last name is required" },
            {
              pattern: /^[A-Za-z\s-']{2,50}$/,
              message:
                "Last name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
            },
          ]}
          className="form-item"
        >
          <Input
            className="input-box"
            placeholder="Enter your last name"
            prefix={<UserOutlined />}
            maxLength={50} // Icon for last name
          />
        </Form.Item>
        <Form.Item className="form-button-container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="default"
              htmlType="button"
              onClick={() => form.resetFields()}
            >
              Clear
            </Button>
            <Button type="default" htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </div>{" "}
        </Form.Item>{" "}
      </Form>{" "}
    </div>
  );
};
