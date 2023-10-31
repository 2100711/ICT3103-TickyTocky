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
} from "antd";
import { getUser, updateUser } from "../../api/users";
import { UserOutlined } from "@ant-design/icons";
import "../styles/Account.css";
import { CertsManagement } from "./CertsManagement";
import { UsersManagement } from "./UsersManagement";
import { CertMember } from "./CertMember";

const { Text } = Typography;
const { Item } = Form;
const { TabPane } = Tabs;

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
      message.error(
        "An error occurred. Please check your input and try again."
      );
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
          </TabPane>
          {user.role !== "admin" && (
            <TabPane tab="Certificates" key="certificates">
              <CertMember email={user.email} />
              {/* Certificates content (only visible to normal users) */}
              {/* {certificates.length > 0 ? (
                <ul className="certificate-list">
                  {certificates.map((certificate) => (
                    <li key={certificate.id}>
                      <Card>
                        <h3>{certificate.name}</h3>
                        <p>Issuer: {certificate.issuer}</p>
                        <p>Issue Date: {certificate.issueDate}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No certificates found.</p>
              )} */}
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
              {/* User Management content (only visible to admins) */}
              {/* <ul className="user-list">
                {users.map((user) => (
                  <li key={user.id}>
                    <Card>
                      <h3>{user.username}</h3>
                      <p>Email: {user.email}</p>
                      <Button onClick={() => handleEditUser(user.id)}>
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </Button>
                    </Card>
                  </li>
                ))}
              </ul> */}
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
                    <Button type="default">Reset Password</Button>
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
