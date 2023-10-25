import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import "../styles/Register.css";
import { register } from "../../api/auth";

export const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        cfmPassword: "",
        f_name: "",
        l_name: "",
    });

    const { email, password, cfmPassword, f_name, l_name } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const response = await register(formData);
                notification.success({
                    message: "Registration successful",
                    description: "You may now login with your credentials",
                    duration: 5,
                });
                navigate("/login");
            } catch (error) {
                console.error("Registration failed", error);
                notification.error({
                    message: "Registration failed",
                    description: "An error occurred during registration",
                    duration: 5,
                });
            }
        }
    };

    const validateForm = () => {
        if (!validateEmail(email) || !validatePassword(password) || !validateCfmPassword(cfmPassword) || !validateFName(f_name) || !validateLName(l_name)) {
            return false;
        }
        return true;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailRegex.test(email)) {
            return true;
        }
        notification.error({
            message: "Invalid Email",
            description: "Please enter a valid email address",
            duration: 5,
        });
        return false;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{12,64}$/;
        if (passwordRegex.test(password)) {
            return true;
        }
        notification.error({
            message: "Invalid Password",
            description: "Password must meet security standards",
            duration: 5,
        });
        return false;
    };

    const validateCfmPassword = (cfmPassword) => {
        if (cfmPassword === password) {
            return true;
        }
        notification.error({
            message: "Passwords do not match",
            description: "Please reenter the same password",
            duration: 5,
        });
        return false;
    };

    const validateFName = (f_name) => {
        const nameRegex = /^[A-Za-z\s]{1,35}$/;
        if (nameRegex.test(f_name)) {
            return true;
        }
        notification.error({
            message: "Invalid First Name",
            description: "Please enter a valid first name (alphabets only)",
            duration: 5,
        });
        return false;
    };

    const validateLName = (l_name) => {
        const nameRegex = /^[A-Za-z\s]{1,35}$/;
        if (nameRegex.test(l_name)) {
            return true;
        }
        notification.error({
            message: "Invalid Last Name",
            description: "Please enter a valid last name (alphabets only)",
            duration: 5,
        });
        return false;
    };

    const handleClear = () => {
        setFormData({
            email: "",
            password: "",
            cfmPassword: "",
            f_name: "",
            l_name: "",
        });
    };

    const handleCancel = () => {
        navigate("/login");
    };

    return (
        <div className="register-container">
            <Form name="register" onFinish={handleSubmit} className="register-form">
                <h2>Register</h2>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Please enter your email!" }]}
                    className="form-item"
                >
                    <Input
                        className="input-box"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Please enter your password!" }]}
                    className="form-item"
                >
                    <Input.Password
                        className="input-box"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </Form.Item>

                <Form.Item
                    name="cfmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Please reenter the same password!" }]}
                    className="form-item"
                >
                    <Input.Password
                        className="input-box"
                        placeholder="Reenter your password"
                        name="cfmPassword"
                        value={cfmPassword}
                        onChange={handleChange}
                    />
                </Form.Item>

                <Form.Item
                    name="f_name"
                    label="First Name"
                    rules={[{ required: true, message: "Please enter your first name!" }]}
                    className="form-item"
                >
                    <Input
                        className="input-box"
                        placeholder="Enter your first name"
                        name="f_name"
                        value={f_name}
                        onChange={handleChange}
                    />
                </Form.Item>

                <Form.Item
                    name="l_name"
                    label="Last Name"
                    rules={[{ required: true, message: "Please enter your last name!" }]}
                    className="form-item"
                >
                    <Input
                        className="input-box"
                        placeholder="Enter your last name"
                        name="l_name"
                        value={l_name}
                        onChange={handleChange}
                    />
                </Form.Item>

                <Form.Item className="form-button-container">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button type="default" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button type="default" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};