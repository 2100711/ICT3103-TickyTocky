import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, notification, Spin } from "antd";
import { transferOwnership } from "../../api/certs";

export const TransferOwnershipModal = ({
  visible,
  onCancel,
  emails,
  user_email,
  cert_id,
  setRefetchCert,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    form.setFieldsValue({
      email: "",
    });
  }, [form, onCancel]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const response = await transferOwnership({
        cert_id,
        current_email: user_email,
        next_email: values.email,
      });
      if (response.success) {
        notification.success({
          message: "Transfer of certificate ownership successful",
          duration: 5,
        });
        setRefetchCert(true);
        onCancel();
      } else {
        notification.error({
          message: "Transfer of certificate ownership failed",
          description: "Please try again.",
          duration: 5,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Transfer of certificate ownership failed",
        description: error.message,
        duration: 5,
      });
      console.error(error);
    }
  };

  return (
    <Modal
      forceRender
      title="Transfer Ownership Form"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin tip="Loading..." spinning={loading}>
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            label="User Email"
            name="email"
            rules={[
              { required: true, message: "Please select the user email" },
            ]}
          >
            {emails && (
              <Select showSearch>
                {emails.map((email) => (
                  <Select.Option key={email} value={email}>
                    {email}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
