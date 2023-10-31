import React, { useState } from "react";
import { Form, Input, Button, notification, Spin } from "antd";
import { Link, useLocation } from "react-router-dom"; // If using React Router for navigation
import "../styles/ForgotPassword.css"; // You can reuse the CSS for the password reset page
import { resetPassword } from "../../api/auth";

export const PasswordReset = () => {
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (validatePassword() && validateCfmPassword()) {
        const response = await resetPassword({
          email: location.state.email,
          password,
        });
        if (response.success) {
          setLoading(false);
          setPasswordUpdated(true);
        } else {
          setLoading(false);
          setPasswordUpdated(false);
          notification.error({
            message: "Error",
            description: response.message,
            duration: 5,
          });
        }
        // console.log("Password reset successful");
      }
    } catch (error) {
      setLoading(false);
      setPasswordUpdated(false);
      notification.error({
        message: "Error",
        description: error.message,
        duration: 5,
      });
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
    <Spin tip="Loading..." size="large" spinning={loading}>
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
                  {
                    pattern:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#%^&+=])(?!.*\s).{14,128}$/,
                    message:
                      "Password must be at least 14 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&+=).",
                  },
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
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
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
    </Spin>
  );
};
