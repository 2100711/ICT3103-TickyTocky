import React, { useEffect, useState } from "react";
import { AuthData } from "../../auth/AuthWrapper";
import { Card, Typography, Spin, Avatar, Button, Modal, Form, Input, message } from 'antd';
import { getUser, updateUser } from "../../api/users";
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Item } = Form;

const validationMessages = {
    required: 'This field is required',
};

export const Account = () => {
    const { user } = AuthData();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const response = await getUser(user.email);
        if (response.success) {
            setUserData(response.user);
        }
        setLoading(false);
    };

    const handleEditProfile = () => {
        setEditProfileModalVisible(true);
        form.setFieldsValue({
            f_name: userData.f_name,
            l_name: userData.l_name,
        });
    };

    const handleSaveProfile = async () => {
        try {
            const values = await form.validateFields();
            const response = await updateUser({
                f_name: values.f_name,
                l_name: values.l_name,
                email: user.email,
            });

            if (response.success) {
                setUserData({
                    ...userData,
                    f_name: values.f_name,
                    l_name: values.l_name,
                });
                message.success("Profile updated successfully.");
            } else {
                message.error("Failed to update profile. Please try again.");
            }

            setEditProfileModalVisible(false);
        } catch (error) {
            message.error("An error occurred. Please check your input and try again.");
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (!userData) {
        return <Text strong>Error loading user data.</Text>;
    }

    return (
        <Card
            title="User Profile"
            style={{ width: 400, margin: "0 auto", padding: 16, textAlign: "center" }}
        >
            <Avatar size={100} icon={<UserOutlined />} />
            <div>
                <Text style={{ fontSize: 24, margin: "10px 0" }}>
                    {userData.f_name} {userData.l_name}
                </Text>
            </div>
            <div>
                <Text>Email: {userData.email}</Text>
            </div>
            <Button type="primary" onClick={handleEditProfile}>
                Edit Profile
            </Button>
            <Modal
                title="Edit Profile"
                visible={editProfileModalVisible}
                onOk={handleSaveProfile}
                onCancel={() => setEditProfileModalVisible(false)}
            >
                <Form form={form} layout="vertical" validateTrigger="onChange">
                    <Item
                        label="First Name"
                        name="f_name"
                        rules={[
                            {
                                required: true,
                                message: validationMessages.required,
                            },
                            {
                                max: 50, // Maximum length of 50 characters
                                message: 'Maximum length for first name is 50 characters',
                            },
                            {
                                pattern: /^[A-Za-z]+$/, // Pattern: only alphabetic characters
                                message: 'First name should only contain alphabetic characters',
                            }
                        ]}
                    >
                        <Input placeholder="First Name" />
                    </Item>
                    <Item
                        label="Last Name"
                        name="l_name"
                        rules={[
                            {
                                required: true,
                                message: validationMessages.required,
                            },
                            {
                                max: 50, // Maximum length of 50 characters
                                message: 'Maximum length for last name is 50 characters',
                            },
                            {
                                pattern: /^[A-Za-z]+$/, // Pattern: only alphabetic characters
                                message: 'Last name should only contain alphabetic characters',
                            }
                        ]}
                    >
                        <Input placeholder="Last Name" />
                    </Item>
                </Form>
            </Modal>
        </Card>
    );
};