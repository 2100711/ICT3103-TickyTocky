import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { Link } from "react-router-dom"; // If using React Router for navigation
import "../styles/ForgotPassword.css"; // You can reuse the CSS for the password reset page

export const PasswordReset = () => {
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");

  const handleSubmit = (values) => {
    // TODO: Implement password reset logic
    if (validatePassword() && validateCfmPassword()) {
      console.log("Password reset successful");
      setPasswordUpdated(true);
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (passwordRegex.test(password)) {
      return true; // Validation successful
    } else {
      notification.error({
        message: "Invalid Password",
        description: "Password must meet security standards",
        duration: 5,
      });
      return false; // Validation failed
    }
  };

  const validateCfmPassword = () => {
    if (cfmPassword === password) {
      return true; // Validation successful
    } else {
      notification.error({
        message: "Passwords do not match",
        description: "Please reenter the same password",
        duration: 5,
      });
      return false; // Validation failed
    }
  };

  return (
    <div className="forgot-password-container">
      <Form onFinish={handleSubmit} className="forgot-password-form">
        <h2>Password Reset</h2>
        {passwordUpdated ? (
          <p>
            Your password has been successfully updated. Click{" "}
            <Link to="/login">Login</Link> to continue.
          </p>
        ) : (
          <>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your new password" },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your new password" },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Confirm Password"
                value={cfmPassword}
                onChange={(e) => setCfmPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};
