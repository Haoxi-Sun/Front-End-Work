import "antd/dist/antd.css";
import {
  Form,
  Input,
  Button,
  Radio,
  Row,
  Col,
  Checkbox,
  Space,
  Typography
} from "antd";
import styled from "styled-components";
import React, { useState } from "react";
import { AES } from "crypto-js";

const Title = styled.h1`
  text-align: center;
  margin-top: 10%;
`;

function Login() {
 
  const [form] = Form.useForm();

  const [Data, setData] = useState({
    info: {
      role: "",
      email: "",
      password: ""
    }
  });
  
  // Store the form information into LocalStorage,
  // then remove data in Data State.
  function handleSubmit(e) {
    const prevData = localStorage.getItem("Data")
      ? JSON.parse(localStorage.getItem("Data"))
      : [];
    // Store data into the sessionStorage
    const newData = [...prevData, Data.info];
    localStorage.setItem("Data", JSON.stringify(newData));
    // Empty the form
    setData({
      info: {
        role: "",
        email: "",
        password: ""
      }
    });
    // Reload the page, and display updated data.
    //window.location.reload();
    window.location.replace(`./dashboard/${Data.info.role}`);
  
  }

  return (
    <>
      <Title>COURSE MANAGEMENT ASSISTANT</Title>
      <Row justify="center">
        <Col span={8}>
        {/* Login Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              rememberMe: true
            }}
            onFinish={handleSubmit}
          >

          {/* Radio for Role(Student, Teacher, and Manager) */}
            <Form.Item name="role" rules={[{ required: true }]}>
              <Radio.Group
                onChange={(e) => {
                  setData((prevValue) => ({
                    info: {
                      ...prevValue.info,
                      role: e.target.value
                    }
                  }));
                }}
              >
                <Radio.Button value="student">Student</Radio.Button>
                <Radio.Button value="teacher">Teacher</Radio.Button>
                <Radio.Button value="manager">Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "'email' is required" },
                { type: "email", message: "'email' is not a valid email" }
              ]}
            >
              <Input
                type="email"
                placeholder="Please input email"
                onChange={(e) => {
                  setData((prevValue) => ({
                    info: {
                      ...prevValue.info,
                      email: e.target.value
                    }
                  }));
                }}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "'password' is required" },
                { min: 4, max: 16 }
              ]}
            >
              <Input.Password
                placeholder="Please input password"
                onChange={(e) => {
                  const pwd = AES.encrypt(e.target.value, "cms").toString();
                  setData((prevValue) => ({
                    info: {
                      ...prevValue.info,
                      password: pwd
                    }
                  }));
                }}
              />
            </Form.Item>

            {/* CheckBox for Remembering Information */}
            <Form.Item name="rememberMe" valuePropName="checked">
              <Checkbox>Remember Me</Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign in
              </Button>
            </Form.Item>
          </Form>

          {/* Sign Up Link */}
          <Space>
            <span>No account?</span>
            <Typography.Link>Sign up</Typography.Link>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default Login;
