import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import { Input, message, Modal, Form, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { addStudent, editStudent } from '../api/api';

const { Option } = Select;

export default function StudentForm(props) {
  const [form] = useForm();
  const isEdit = !!props.value;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(props.value);
    } else {
      form.setFieldsValue({
        name: '',
        country: '',
        email: '',
        type: '',
      });
    }
  }, [props.value]);

  const addOne = (values) => {
    setIsLoading(true);
    addStudent(values)
      .then((res) => {
        props.setIsModalVisible(false);
        if (res) {
          message.success('Success');
        }
      })
      .finally(() => setIsLoading(false));
  };

  const editOne = (values) => {
    setIsLoading(true);
    editStudent({
      id: props.value.id,
      name: values.name,
      country: values.country,
      type: values.type,
      email: values.email,
    })
      .then((res) => {
        props.setIsModalVisible(false);
        if (res) {
          message.success('Success');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Modal
        forceRender
        title={isEdit ? 'Edit Student' : 'Add Student'}
        afterClose={() => form.resetFields()}
        centered
        destroyOnClose
        onOk={() => {
          form.validateFields().then((params) => {
            if (isEdit) {
              editOne(params);
            } else {
              addOne({ ...props.value, ...params });
            }
          });
        }}
        okText={isEdit ? 'Update' : 'Add'}
        visible={props.isModalVisible}
        onCancel={() => {
          props.setIsModalVisible(false);
        }}
        okButtonProps={{ disabled: isLoading }}
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
            rules={[{ required: true }, { type: 'email' }]}
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
