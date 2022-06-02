import React, { useEffect, useState } from "react";
import 'antd/dist/antd.min.css';
import {
  MessageOutlined,
  ReadOutlined,
  DeploymentUnitOutlined,
  SolutionOutlined,
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import styled from "styled-components";
import {  useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const Logo = styled.span`
  color: rgb(255, 255, 255);
  text-align: center;
  height: "32px";
  margin: "16px";
  background: rgba(255, 255, 255, 0.3);
`;

const classContent = {
  margin: "24px 16px",
  padding: 24,
  minHeight: 280,
  background: "#fff",
};

const classTrigger = {
  padding: "0 24px",
  fontSize: "18px",
  lineHeight: "64px",
  cursor: "pointer",
  transition: "color 0.3s",

  "&:hover": {
    color: "#1890ff",
  },
};

export default function Student() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length === 0) {
      navigate("/");
    }
  });

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div>
          <Logo>CMS</Logo>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Overview",
            },
            {
              key: "2",
              icon: <SolutionOutlined />,
              label: "Student",
            },
            {
              key: "3",
              icon: <DeploymentUnitOutlined />,
              label: "Teacher",
            },
            {
              key: "4",
              icon: <ReadOutlined />,
              label: "Course",
            },
            {
              key: "5",
              icon: <MessageOutlined />,
              label: "Message",
            },
          ]}
        />
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Header
          style={{
            padding: 0,
            background: "#fff",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              style: { classTrigger },
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content style={classContent}>
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Content>
      </Layout>
    </Layout>
  );
}
