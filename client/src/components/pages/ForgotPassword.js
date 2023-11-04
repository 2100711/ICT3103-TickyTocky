import React, { useState } from "react";
import { Form, Input, Button, notification, Alert, Space, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";
import { generateOTP } from "../../api/auth";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to handle the submission of the form
  const handleSubmit = async () => {
    try {
      if (validateEmail()) {
        setLoading(true);
        const response = await generateOTP({ email });
        if (response.success) {
          setLoading(false);
          openNotification("info", "Password Reset Email Sent");
          // navigate
          navigate("/login", { state: { email: email } });
        } else {
          setLoading(false);
          openNotification("error", "Error", response.message);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  // Function to validate the email using regex
  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(email)) {
      return true; // Validation successful
    } else {
      openNotification(
        "error",
        "Invalid Email",
        "Please enter a valid email address."
      );
      return false; // Validation failed
    }
  };

  return (
    <Spin tip="Loading..." size="large" spinning={loading}>
      <div className="forgot-password-container">
        <Form onFinish={handleSubmit} className="forgot-password-form">
          <h2>Forgot Password</h2>
          <p>An OTP will be sent to the email provided below.</p>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Code
            </Button>
          </Form.Item>
          <p>
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    </Spin>
  );
};
