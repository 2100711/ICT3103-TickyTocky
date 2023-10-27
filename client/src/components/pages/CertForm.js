import React, { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Tabs,
    Radio,
    notification,
} from "antd";
import { getAllUsers } from "../../api/users";
import { createCert } from "../../api/certs";
import jsPDF from "jspdf";
import {
    WATCH_BRANDS,
    WATCH_MOVEMENTS,
    WATCH_CASE_MATERIALS,
    BRACELET_STRAP_MATERIALS,
} from "../../constants";

const { TabPane } = Tabs;

export const CertForm = ({ visible, onCancel }) => {
    const [activeTab, setActiveTab] = useState("serial");
    const [userEmails, setUserEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form] = Form.useForm();

    useEffect(() => {
        getAllUsers()
            .then((response) => {
                setUserEmails(response.emails);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user emails:", error);
                setLoading(false);
            });
    }, []);

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleCancel = () => {
        onCancel();
    };

    // TODO: handleNext and handlePrevious works but if in the next form there are empty fields, the next button would not work
    const handleNext = () => {
        // Handle the next button logic, e.g., validate and move to the next tab
        setActiveTab((current) => {
            return current === "serial" ? "watch" : "cert";
        });
    };

    const handlePrevious = () => {
        // Handle the previous button logic, e.g., move back to the previous tab
        setActiveTab((current) => {
            return current === "cert" ? "watch" : "serial";
        });
    };

    const handleFinish = async (values) => {
        const doc = new jsPDF();
        doc.text("Certificate of Validation", 10, 10);
        doc.text("User Email: " + values.user_email, 10, 30);
        doc.text("Validated By: " + values.validated_by, 10, 40);
        doc.text("Date of Validation: " + values.date_of_validation, 10, 50);
        doc.text("Issue Date: " + values.issue_date, 10, 60);
        doc.text("Expiry Date: " + values.expiry_date, 10, 70);
        doc.text("Remarks: " + values.remarks, 10, 80);

        const pdfContent = doc.output('datauristring');

        const data = { ...values, pdf_content: pdfContent };

        try {
            const response = await createCert(data);

            // Show a success notification
            notification.success({
                message: "Certificate Creation Successful",
                description: "The certificate has been successfully created and is now available for viewing and download. Thank you for using our services.",
                duration: 5,
            });

            // Close the modal
            onCancel();
        } catch (error) {
            // Show an error notification
            notification.error({
                message: "Certificate Creation Failed",
                description: "We apologize, but we encountered an issue while trying to create the certificate. Please try again later or contact our support team for assistance.",
                duration: 5,
            });
        }
    };


    return (
        <Modal
      title="Certificate Form"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Serial Number Form" key="serial">
          <Form layout="vertical" onFinish={handleNext} form={form}>
            <Form.Item
              label="Case Serial Numbers"
              name="case_serial"
              rules={[
                { required: true, message: "Case serial numbers is required" },
                { pattern: /^[A-Za-z0-9]{8}$/, message: "Case serial numbers must be 8 characters long and contain only letters and numbers." },
              ]}
            >
              <Input maxLength={8}/>
            </Form.Item>
            <Form.Item
              label="Movement Serial"
              name="movement_serial"
              rules={[
              { required: true, message: "Movement serial numbers is required" },
              { pattern: /^[A-Za-z0-9]{10,12}$/, message: "Movement serial numbers must be 10-12 characters long and contain only letters and numbers." },
              ]}
            >
              <Input maxLength={12}/>
            </Form.Item>
            <Form.Item
              label="Dial Serial"
              name="dial"
              rules={[
              { required: true, message: "Dial serial numbers is required" },
              { pattern: /^[A-Za-z0-9]{8}$/, message: "Dial serial numbers must be 8 characters long and contain only letters and numbers." },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
            label="Bracelet/Strap Serial"
            name="bracelet_strap"
            rules={[
              { pattern: /^[A-Za-z0-9]{6,8}$/, message: "Bracelet or strap serial numbers must be 6-8 characters long and contain only letters and numbers." },
              ]}
            >
              <Input maxLength={8}/>
            </Form.Item>
            <Form.Item label="Crown/Pusher Serial" name="crown_pusher"
            rules={[
              { pattern: /^[A-Za-z0-9]{5,7}$/, message: "Crown pusher serial numbers must be 5-7 characters long and contain only letters and numbers." },
              ]}
            >
              <Input maxLength={7}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Watch Form" key="watch">
          <Form layout="vertical" onFinish={handleNext} form={form}>
            <Form.Item
  label="Brand"
  name="brand"
  rules={[{ required: true, message: "Please select the brand" }]}
>
  <Select placeholder="Select a brand">
    {WATCH_BRANDS.map((brand) => (
      <Select.Option key={brand} value={brand}>
        {brand}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
            <Form.Item
              label="Model No"
              name="model_no"
              rules={[
              { required: true, message: "Model numbers is required" },
              { pattern: /[A-Za-z0-9-]{10}/, message: "Model number must be 10 alphanumeric characters or hyphens." },
              ]}
            >
              <Input maxLength={10}/>
            </Form.Item>
            <Form.Item
              label="Model Name"
              name="model_name"
              rules={[
              { required: true, message: "Model name is required" },
              { pattern: /\b[A-Za-z0-9-]+(?:\s[A-Za-z0-9-]+)+\b/, message: "Model name must contain only letters, numbers, and hyphens, separated by spaces." },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
  label="Movement"
  name="movement"
  rules={[{ required: true, message: "Please select the movement" }]}
>
  <Select placeholder="Select a movement">
    {WATCH_MOVEMENTS.map((movement) => (
      <Select.Option key={movement} value={movement}>
        {movement}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
<Form.Item
  label="Case Material"
  name="case_material"
  rules={[{ required: true, message: "Please select the case material" }]}
>
  <Select placeholder="Select a case material">
    {WATCH_CASE_MATERIALS.map((caseMaterial) => (
      <Select.Option key={caseMaterial} value={caseMaterial}>
        {caseMaterial}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
<Form.Item
  label="Bracelet/Strap Material"
  name="bracelet_strap_material"
  rules={[{ required: true, message: "Please select the bracelet/strap material" }]}
>
  <Select placeholder="Select a bracelet/strap material">
    {BRACELET_STRAP_MATERIALS.map((braceletStrapMaterial) => (
      <Select.Option key={braceletStrapMaterial} value={braceletStrapMaterial}>
        {braceletStrapMaterial}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
            <Form.Item
  label="Year of Production"
  name="yop"
  rules={[
    {
      required: true,
      message: "Please select the year of production",
    },
  ]}
>
  <DatePicker.YearPicker
    format="YYYY"
    placeholder="Select year"
    picker="year"
    disabledDate={(current) => current && current.year() < 1969}
  />
</Form.Item>
            <Form.Item
  label="Gender"
  name="gender"
  rules={[{ required: true, message: "Please select your gender" }]}
>
  <Radio.Group>
    <Radio value="Male">Male</Radio>
    <Radio value="Female">Female</Radio>
  </Radio.Group>
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
          <Form layout="vertical" onFinish={handleFinish} form={form}>
            <Form.Item
              label="User Email"
              name="user_email"
              rules={[
                { required: true, message: "Please select the user email" },
              ]}
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
                { required: true, message: "Validated by is required" },
                { pattern: /^[A-Za-z\s-']{2,50}$/, message: "Validated by must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes." },
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
      message: "Please select the date of validation",
    },
  ]}
>
  <DatePicker valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />
</Form.Item>

<Form.Item
  label="Issue Date"
  name="issue_date"
  rules={[
    { required: true, message: "Please select the issue date" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const dateOfValidation = getFieldValue("date_of_validation");
        if (!dateOfValidation || !value || dateOfValidation.isBefore(value)) {
          return Promise.resolve();
        }
        return Promise.reject("Issue Date must come after Date of Validation");
      },
    }),
  ]}
>
  <DatePicker valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />
</Form.Item>

<Form.Item
  label="Expiry Date"
  name="expiry_date"
  rules={[
    { required: true, message: "Please select the expiry date" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const issueDate = getFieldValue("issue_date");
        if (!issueDate || !value || issueDate.isBefore(value)) {
          return Promise.resolve();
        }
        return Promise.reject("Expiry Date must come after Issue Date");
      },
    }),
  ]}
>
  <DatePicker valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />
</Form.Item>

            <Form.Item
              label="Remarks"
              name="remarks"
              rules={[{ required: true, message: "Please enter the remarks" }]}
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