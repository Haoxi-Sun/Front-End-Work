import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import { Input, message, Modal, Form, Select, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';
const { Option } = Select;

export default function TeacherForm({ isModalVisible, setIsModalVisible }) {
  const [form] = useForm();

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }} initialValue="64">
        <Option value="64">+64</Option>
        <Option value="65">+65</Option>
      </Select>
    </Form.Item>
  );
  return (
    <>
      <Modal
        centered
        destroyOnClose
        visible={isModalVisible}
        title="Add Teacher"
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          autoComplete="off"
          labelCol={({ offset: 3 }, { span: 8 })}
          wrapperCol={{
            offset: 1,
          }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Teacher Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email' }, { required: true }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input addonBefore={prefixSelector} />
          </Form.Item>

        <Form.Item label={<b>skills:</b>} name="skills"></Form.Item>
          <Form.List name="skills">
            
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}
