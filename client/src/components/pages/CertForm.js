import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, DatePicker, Upload, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getAllUsers } from "../../api/users"
import { createCert } from "../../api/certs"

const { TabPane } = Tabs;

export const CertForm = ({ visible, onCancel }) => {
    const [activeTab, setActiveTab] = useState("serial");
    const [userEmails, setUserEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user emails here and set the user emails state variable
        getAllUsers()
            .then((response) => {
                console.log(response);
                setUserEmails(response.emails);
                setLoading(false); // Set loading to false when data is loaded
            })
            .catch((error) => {
                console.error("Error fetching user emails:", error);
                setLoading(false); // Set loading to false on error
            });
    }, []); // Empty dependency array ensures this effect runs only once on mount



    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleNext = () => {
        // Handle the next button logic, e.g., validate and move to the next tab
    };

    const handlePrevious = () => {
        // Handle the previous button logic, e.g., move back to the previous tab
    };

    const handleFinish = (values) => {
        createCert(values)
            .then((response) => {
                // Handle success, e.g., show a success message
                console.log("Certificate created:", response);
            })
            .catch((error) => {
                // Handle error, e.g., show an error message
                console.error("Error creating certificate:", error);
            });
    };

    return (
        <Modal
      title="Certificate Form"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Serial Number Form" key="serial">
          <Form layout="vertical" onFinish={handleNext}>
            <Form.Item
              label="Case Serial"
              name="case_serial"
              rules={[
                { required: true, message: "Please enter the case serial" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Movement"
              name="movement"
              rules={[
                { required: true, message: "Please enter the movement" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Dial"
              name="dial"
              rules={[{ required: true, message: "Please enter the dial" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Bracelet/Strap" name="bracelet_strap">
              <Input />
            </Form.Item>
            <Form.Item label="Crown/Pusher" name="crown_pusher">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Watch Form" key="watch">
          <Form layout="vertical" onFinish={handleNext}>
            <Form.Item label="Brand" name="brand" rules={[{ required: true, message: "Please enter the brand" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Model No" name="model_no" rules={[{ required: true, message: "Please enter the model number" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Model Name" name="model_name" rules={[{ required: true, message: "Please enter the model name" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Movement" name="movement" rules={[{ required: true, message: "Please enter the movement" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Case Material" name="case_material" rules={[{ required: true, message: "Please enter the case material" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Bracelet/Strap Material" name="bracelet_strap_material" rules={[{ required: true, message: "Please enter the bracelet/strap material" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Year of Production" name="yop" rules={[{ required: true, message: "Please select the year of production" }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please enter the gender" }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
              <Button onClick={handlePrevious}>Previous</Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Cert Form" key="cert">
          <Form layout="vertical" onFinish={handleFinish}>
            <Form.Item
    label="User Email"
    name="user_email"
    rules={[{ required: true, message: "Please select the user email" }]}
>
    {loading ? (
        <p>Loading user emails...</p>
    ) : (
        <Select showSearch>
            {userEmails.map((email) => (
                <Select.Option key={email} value={email}>
                    {email}
                </Select.Option>
            ))}
        </Select>
    )}
</Form.Item>

            <Form.Item
              label="Validated By"
              name="validated_by"
              rules={[
                { required: true, message: "Please enter the validated by" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date of Validation"
              name="date_of_validation"
              rules={[
                {
                  required: true,
                  message: "Please enter the date of validation",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Issue Date"
              name="issue_date"
              rules={[
                { required: true, message: "Please select the issue date" },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Expiry Date"
              name="expiry_date"
              rules={[
                { required: true, message: "Please select the expiry date" },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Remarks"
              name="remarks"
              rules={[
                { required: true, message: "Please enter the remarks" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handlePrevious}>Previous</Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
    );
};