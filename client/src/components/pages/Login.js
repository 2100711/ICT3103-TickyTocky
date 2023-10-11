import React, { useEffect } from "react";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { login, user } = AuthData();
  const [formData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { email: "", password: "" }
  );
  const [setErrorMessage] = useState(null);

  useEffect(() => {
    if (user.isAuthenticated) navigate("/");
  });

  const onFinish = async () => {
    const { success, message } = await login(formData.email, formData.password);
    if (success) {
      navigate("/account");
    }
    setErrorMessage(message);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <h2>Ticky Tocky</h2>
        </div>
        <Form name="login-form" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="input-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Log In
            </Button>
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form>
        <p className="register-link">
          Don't have an account? <a href="/">Register</a>
        </p>
        <p className="forgot-password-link">
          <a href="/">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};
