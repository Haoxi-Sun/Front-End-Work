import React from 'react';
import HomeHeader from '../../components/home/homeHeader';
import { Row, Col, Typography, Form, Radio, Input, Button, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {signUp} from '../../api/api';
import {useNavigate} from 'react-router-dom';
const title = {
  display: 'flex',
  justifyContent: 'center',
  alignItem: 'center',
  marginTop: '50px',
};

export default function SignUp() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  return (
    <>
      <HomeHeader />
      <Typography.Title level={1} style={title}>
        SIGN UP YOUR ACCOUNT
      </Typography.Title>
      <Row justify="center">
        <Col sm={{ span: 24 }} md={{ span: 8 }}>
          <Form form={form} layout="vertical" onFinish={(values) => {
            signUp(values).then(res => {
                if(res){
                    navigate('/login', {replace: true});
                }
            }) 
          }}>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Radio value="student">Student</Radio>
                <Radio value="teacher">Teacher</Radio>
                <Radio value="manager">Manager</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Please input email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password placeholder="Please input password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Tap password again" />
            </Form.Item>
            <Form.Item>
              <Button style={{width:'100%'}} type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <Space>
            <span>Already have an account?</span>
            <Typography.Link href='/login'>Sign in</Typography.Link>
          </Space>
        </Col>
      </Row>
    </>
  );
}
