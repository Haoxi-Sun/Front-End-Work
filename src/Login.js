import "antd/dist/antd.min.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Radio,
  Row,
  Col,
  Checkbox,
  Space,
  Typography,
  message,
} from "antd";
import styled from "styled-components";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AES } from "crypto-js";
import axios from "axios";

const Title = styled.h1`
  text-align: center;
  margin-top: 10%;
`;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    axios
      .post("http://cms.chtoma.com/api/login", {
        ...event,
        password: AES.encrypt(event.password, "cms").toString(),
      })
      .then((response) => {
        const data = response.data.data;
        localStorage.setItem("Data", JSON.stringify(data));
        navigate(`/dashboard/${data.role}`, {state: data});
      })
      .catch((error) => {
        message.error("Wrong Password!");
      });
  };

  return (
    <>
      <Title>COURSE MANAGEMENT ASSISTANT</Title>
      <Row justify="center">
        <Col span={8}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              rememberMe: true,
              role: "student",
            }}
            onFinish={handleSubmit}
          >
            <Form.Item name="role" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio.Button value="student">Student</Radio.Button>
                <Radio.Button value="teacher">Teacher</Radio.Button>
                <Radio.Button value="manager">Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "'email' is required" },
                { type: "email", message: "'email' is not a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                type="email"
                placeholder="Please input email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "'password' is required" },
                { min: 4, max: 16 },
              ]}
            >
              <Input.Password
                placeholder="Please input password"
                autoComplete="on"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item name="rememberMe" valuePropName="checked">
              <Checkbox>Remember Me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <Space>
            <span>No account?</span>
            <Typography.Link>Sign up</Typography.Link>
          </Space>
        </Col>
      </Row>
    </>
  );
}
