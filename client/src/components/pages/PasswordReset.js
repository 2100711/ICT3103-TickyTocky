import React, { useState, useEffect } from "react";
import { Form, Input, Button, notification, Spin } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom"; // If using React Router for navigation
import "../styles/ForgotPassword.css"; // You can reuse the CSS for the password reset page
import { resetPassword } from "../../api/auth";

export const PasswordReset = () => {
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('t');
  console.log(token);
  useEffect(()=>{
    if (!token) {
      navigate("/");
    }
  },[token, navigate])
  if (!token) {
    return null; // Return null to prevent rendering the login page.
  }

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (validatePassword() && validateCfmPassword()) {
        const response = await resetPassword({
          token,
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

  // Function to validate the new password against the specified regex pattern
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/;
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

  // Function to ensure the password and confirmation password match
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
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/,
                    message:
                      "Password must be 12-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&*()\-_+).",
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
