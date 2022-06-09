import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { Input, message, Modal, Form, Select } from "antd";
import axios from "axios";
const { Option } = Select;

export default function StudentForm(props) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!props.value;

  const addStudent = (values) => {
        const token = JSON.parse(localStorage.getItem("Data")).token;
        setIsLoading(true);
        axios
          .post("http://cms.chtoma.com/api/students", values, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            props.setIsModalVisible(false);
            message.success("Success");
          })
          .catch((error) => {
            message.error("Cannot add this student!");
          }).finally(() => {
            setIsLoading(false);
          });
  };

  const editStudent = (values) => {
        const token = JSON.parse(localStorage.getItem("Data")).token;
        setIsLoading(true);
        axios
          .put(
            "http://cms.chtoma.com/api/students",
            {
              id: props.value.id,
              name: values.name,
              country: values.country,
              type: values.type,
              email: values.email,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((response) => {
            props.setIsModalVisible(false);
            message.success("Success");
          })
          .catch((error) => {
            message.error("Cannot edit this student!");
          }).finally(() => {
            setIsLoading(false);
          });
  };
  return (
    <>
      <Modal
        title={isEdit ? "Edit Student" : "Add Student"}
        afterClose={() => form.resetFields()}
        centered
        onOk={() => {
          form.validateFields().then((params) => {
            // const params = form.getFieldsValue();
            if (isEdit) {
            editStudent(params);
          } else {
            addStudent({ ...props.value, ...params});
          }
          });
        }}
        okText={isEdit ? "Update" : "Add"}
        visible={props.isModalVisible}
        onCancel={() => props.setIsModalVisible(false)}
        okButtonProps={{disabled : isLoading}}
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            offset: 1,
          }}
          layout="horizontal"
          initialValues={props.value ?? {}}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Area" name="country" rules={[{ required: true }]}>
            <Select>
              <Option value="China">China</Option>
              <Option value="New Zealand">New Zealand</Option>
              <Option value="Canada">Canada</Option>
              <Option value="Australia">Australia</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Student Type"
            name="type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="1">Tester</Option>
              <Option value="2">Developer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
