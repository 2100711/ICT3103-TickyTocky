import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import "../styles/Register.css";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    fetch("http://localhost:3001/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [email]: data.get(email),
        [cfmPassword]: data.get(cfmPassword),
        [fname]: data.get(fname),
        [lname]: data.get(lname),
      }),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setCfmPassword("");
    setFname("");
    setLname("");
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(email)) {
      return true; // Validation successful
    } else {
      notification.error({
        message: "Invalid Email",
        description: "Please enter a valid email address",
        duration: 5,
      });
      return false; // Validation failed
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

  const validateFName = () => {
    const nameRegex = /^[A-Za-z]+$/i;
    if (nameRegex.test(fname)) {
      return true; // Validation successful
    } else {
      notification.error({
        message: "Invalid First Name",
        description: "Please enter a valid first name (alphabets only)",
        duration: 5,
      });
      return false; // Validation failed
    }
  };

  const validateLName = () => {
    const nameRegex = /^[A-Za-z]+$/i;
    if (nameRegex.test(lname)) {
      return true; // Validation successful
    } else {
      notification.error({
        message: "Invalid Last Name",
        description: "Please enter a valid last name (alphabets only)",
        duration: 5,
      });
      return false; // Validation failed
    }
  };

  return (
    <div className="register-container">
      <Form name="register" onFinish={handleSubmit} className="register-form">
        <h2>Register</h2>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { validator: validateEmail },
          ]}
          className="form-item"
        ></Form.Item>
        <Input
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your password!" },
            { validator: validatePassword },
          ]}
          className="form-item"
        ></Form.Item>
        <Input.Password
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Form.Item
          name="cfmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match")
                );
              },
            }),
          ]}
          className="form-item"
        ></Form.Item>
        <Input.Password
          className="input-box"
          value={cfmPassword}
          onChange={(e) => setCfmPassword(e.target.value)}
        />

        <Form.Item
          name="fname"
          label="First Name"
          rules={[
            { required: true, message: "Please input your first name!" },
            { validator: validateFName },
          ]}
          className="form-item"
        ></Form.Item>
        <Input
          className="input-box"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />

        <Form.Item
          name="lname"
          label="Last Name"
          rules={[
            { required: true, message: "Please input your last name!" },
            { validator: validateLName },
          ]}
          className="form-item"
        ></Form.Item>
        <Input
          className="input-box"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />

        <Form.Item className="form-button-container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="default"
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              type="default"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="register-button"
            >
              Register
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
