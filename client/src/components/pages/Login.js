import React, { useEffect } from "react";
import { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { login, user } = AuthData();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { email: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user.isAuthenticated) navigate("/");
  });

  const handleLogin = async () => {
    const { success, message } = await login(formData.email, formData.password);

    if (success) {
      navigate("/account");
    } else {
      setErrorMessage(message);
      // Display error message as a notification
      notification.error({
        message: "Login Error",
        description: message,
        duration: 5,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <h2>Ticky Tocky</h2>
        </div>
        <Form name="login-form" onFinish={handleLogin}>
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
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ password: e.target.value })}
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
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgotpassword">Forgot Password?</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
