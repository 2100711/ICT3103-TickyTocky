import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // TODO: Handle password reset request logic here
    if (validateEmail()) {
      console.log("Email is valid");
    }
    openNotification(
      "info",
      "Password Reset Email Sent",
      "If the email you provided is in our system you will receive instructions to reset your password."
    );
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

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
  );
};
