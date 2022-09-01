import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import {
  FileProtectOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Input, Button, Form, Select, Row, Col, Slider } from 'antd';
const { Option } = Select;

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="64">+64</Option>
      <Option value="65">+65</Option>
    </Select>
  </Form.Item>
);

const SkillLevel = ['Know', 'Practiced', 'Comprehend', 'Expert', 'Master'];

export default function TeacherForm({ isAdd, editValues, form }) {
console.log(editValues?.skills);
  return (
    <>
      <Form
        form={form}
        name="teacherForm"
        autoComplete="off"
        labelCol={({ offset: 3 }, { span: 8 })}
        wrapperCol={{
          offset: 1,
        }}
        initialValues={{
          name: editValues?.name,
          email: editValues?.email,
          country: editValues?.country,
          phone: editValues?.phone,
          skills: isAdd ? [{ name: '', level:1}] : editValues?.skills ,
        }}
        preserve={false}
        onFinish={(values) => console.log(values)}
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
        <Form.Item label="Country" name="country" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input addonBefore={prefixSelector} />
        </Form.Item>

        <Form.Item label={<b>skills</b>}></Form.Item>
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row align="middle" justify="space-between" key={field.name}>
                  <Col span={7}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'name']}
                      rules={[{ required: true }]}
                    >
                      <Input style={{ textAlign: 'right' }} />
                    </Form.Item>
                  </Col>

                  <Col span={13}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'level']}
                    >
                      <Slider
                        step={1}
                        min={0}
                        max={4}
                        tipFormatter={(value) => SkillLevel[value]}
                      />
                    </Form.Item>
                  </Col>

                  <Col style={{ alignSelf: 'stretch' }}>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(field.name)}
                        style={{ margin: '10px 0 0 10px', color: 'red' }}
                      />
                    )}
                  </Col>
                </Row>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Skill
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
}
