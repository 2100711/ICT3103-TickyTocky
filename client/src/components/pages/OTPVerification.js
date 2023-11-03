import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, notification, Spin } from "antd";
import "../styles/OTPVerification.css";
import { generateOTP, verifyOTP } from "../../api/auth";

export const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      window.history.replaceState({}, location.state);
    }
  }, [location.state]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await verifyOTP({
      email: email,
      otp: values.otp,
    });
    if (response.success) {
      setLoading(false);
      openNotification("success", "Success", "Your OTP has been verified.");
      navigate("/resetpassword", { state: { email: email } });
    } else {
      setLoading(false);
      openNotification("error", "OTP Verification Failed", response.message);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    const generateOTPResponse = await generateOTP({ email: email });

    if (generateOTPResponse.success) {
      openNotification(
        "info",
        "OTP Resent",
        "Please check your inbox/junk folder for the new OTP."
      );
    } else {
      openNotification("error", "Error", "Please try again later.");
    }
    setLoading(false);
  };

  return (
    <Spin tip="Loading..." size="large" spinning={loading}>
      <div className="otp-container">
        <Form onFinish={handleSubmit} className="otp-form">
          <h2 className="otp-form-h2">OTP Verification</h2>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Please enter your OTP" }]}
            className="otp-item"
          >
            <Input placeholder="Enter OTP" className="otp-input-box" />
          </Form.Item>
          <Form.Item className="otp-button-container">
            {!email ? (
              <span style={{ color: "red" }}>Error</span>
            ) : (
              <div>
                <Button type="primary" htmlType="submit">
                  Verify
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};
