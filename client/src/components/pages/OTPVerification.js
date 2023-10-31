import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, notification, Spin } from "antd";
import "../styles/OTPVerification.css";
import { verifyOTP } from "../../api/auth";

export const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [timerActive, setTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    return formattedTime;
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  useEffect(() => {
    if (timerActive && totalSeconds > 0) {
      const timer = setInterval(() => {
        setTotalSeconds(totalSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (totalSeconds === 0) {
      setTimerActive(false);
      openNotification(
        "warning",
        "OTP Expired",
        "Please request for a new OTP."
      );
    }
  }, [totalSeconds, timerActive]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await verifyOTP({
      email: location.state.email,
      otp: values.otp,
    });
    if (response.success) {
      setLoading(false);
      openNotification(
        "success",
        "Success",
        "Your OTP have been successfully verified."
      );
      navigate("/resetpassword", { state: { email: location.state.email } });
    } else {
      setLoading(false);
      openNotification("error", "OTP Verification Failed", response.message);
    }
  };

  const resendOTP = () => {
    // TODO: Implement the resend OTP logic
    setTimerActive(true);
    setTotalSeconds(300);
    openNotification(
      "info",
      "OTP Resent",
      "Please check your inbox/junk folder for the new OTP."
    );
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
            <Button type="primary" htmlType="submit">
              Verify
            </Button>
            {timerActive ? (
              `\nResend OTP in ${formatTime(totalSeconds)}`
            ) : (
              <Button type="default" onClick={resendOTP}>
                Resend Code
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};
