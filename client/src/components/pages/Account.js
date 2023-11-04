import React, { useEffect, useState } from "react";
import { AuthData } from "../../auth/AuthWrapper";
import {
  Tabs,
  Card,
  Typography,
  Spin,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  message,
  Checkbox,
  notification,
} from "antd";
import { getUser, updateUser } from "../../api/users";
import { UserOutlined } from "@ant-design/icons";
import "../styles/Account.css";
import { CertsManagement } from "./CertsManagement";
import { UsersManagement } from "./UsersManagement";
import { CertMember } from "./CertMember";
import { resetPassword, updatePassword } from "../../api/auth";

const { Text } = Typography;
const { Item } = Form;
const { TabPane } = Tabs;

export const Account = () => {
  const { user } = AuthData();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    resetPasswordForm.setFieldValue({
      new_password: "",
      cfm_new_password: "",
    });
  }, [resetPasswordForm]);

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
      message.error(
        "An error occurred. Please check your input and try again."
      );
    }
  };

  const handleShowResetPasswordModal = () => {
    setResetPasswordModalVisible(true);
  };

  const handleResetPassword = async () => {
    const values = await resetPasswordForm.validateFields();
    try {
      setLoading(true);
        const response = await updatePassword({
          email: userData.email,
          password: values.new_password,
        });
        if (response.success) {
          notification.success({
            message: "Success",
            description: "Password successfully reset.",
            duration: 5,
          });
          setResetPasswordModalVisible(false);
        } else {
          notification.error({
            message: "Error",
            description: response.message,
            duration: 5,
          });
        }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!userData) {
    return <Text strong>Error loading user data.</Text>;
  }

  return (
    <div className="account">
      <Card className="account-card">
        <Tabs>
          <TabPane tab="Profile" key="profile">
            <div className="profile-container">
              <div className="profile-avatar">
                <Avatar size={100} icon={<UserOutlined />} />
              </div>
              <div className="profile-info">
                <h1 className="user-name">
                  {userData.f_name} {userData.l_name}
                </h1>
                <p className="user-email">Email: {userData.email}</p>
                <Button type="primary" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              </div>
            </div>
            <Modal
              forceRender
              title="Edit Profile"
              open={editProfileModalVisible}
              onOk={handleSaveProfile}
              onCancel={() => setEditProfileModalVisible(false)}
            >
              <Form form={form} layout="vertical" validateTrigger="onChange">
                <Item
                  label="First Name"
                  name="f_name"
                  rules={[
                    { required: true, message: "First name is required" },
                    {
                      pattern: /^[A-Za-z\s-']{2,50}$/,
                      message:
                        "First name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
                    },
                  ]}
                >
                  <Input placeholder="First Name" maxLength={50} />
                </Item>
                <Item
                  label="Last Name"
                  name="l_name"
                  rules={[
                    { required: true, message: "Last name is required" },
                    {
                      pattern: /^[A-Za-z\s-']{2,50}$/,
                      message:
                        "Last name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
                    },
                  ]}
                >
                  <Input placeholder="Last Name" maxLength={50} />
                </Item>
              </Form>
            </Modal>
            <Modal
              forceRender
              title="Reset Password"
              open={resetPasswordModalVisible}
              onCancel={() => setResetPasswordModalVisible(false)}
              onOk={handleResetPassword}
            >
              <Spin tip="Loading..." size="large" spinning={loading}>
                <Form
                  form={resetPasswordForm}
                  layout="vertical"
                >
                  <Form.Item
                    label="New Password"
                    name="new_password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/,
                        message:
                          "New Password must be 12-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&*()\-_+).",
                      },
                    ]}
                  >
                    <Input.Password
                      type="password"
                      placeholder="New Password"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm New Password"
                    name="cfm_new_password"
                    dependencies={["new_password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please re-enter the same password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
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
                    />
                  </Form.Item>      
                </Form>
              </Spin>
            </Modal>
          </TabPane>
          {user.role !== "admin" && (
            <TabPane tab="Certificates" key="certificates">
              <CertMember email={user.email} />
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="Certificate Management" key="certificateManagement">
              <CertsManagement />
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="User Management" key="userManagement">
              <UsersManagement />
            </TabPane>
          )}
          <TabPane tab="Settings" key="settings">
            {/* Settings content here */}
            <div className="settings-form">
              {/* Settings content here */}
              <div className="settings-form">
                <Form layout="vertical">
                  <Form.Item label="Security Settings">
                    <Checkbox>Enable Two-Factor Authentication</Checkbox>
                  </Form.Item>
                  <Form.Item label="Notification Preferences">
                    <Checkbox>Email Notifications</Checkbox>
                    <Checkbox>Push Notifications</Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">Save Settings</Button>
                    <Button
                      type="default"
                      onClick={handleShowResetPasswordModal}
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
