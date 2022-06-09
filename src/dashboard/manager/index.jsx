import React, { useState } from "react";
import "antd/dist/antd.min.css";
import SiderBar from "../../components/siderBar";
import HeaderBar from "../../components/header";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import StudentTable from "./students/index";
import Overview from "./overview";

const { Header, Sider, Content } = Layout;

export default function Manager() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
        }}
      >
        <SiderBar />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            top: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            zIndex: "10",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              style: {
                padding: "0 24px",
                fontSize: "18px",
                lineHeight: "64px",
                cursor: "pointer",
                transition: "color 0.3s",
                color: "#fff",
              },
              onMouseOver: (event) => (event.target.style.color = "#1890ff"),
              onMouseOut: (event) => (event.target.style.color = "#fff"),
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <HeaderBar />
        </Header>

        <Breadcrumb style={{ margin: "0 16px", padding: "16px" }}>
          <Breadcrumb.Item>
            <a href="./overview">CMS MANAGER SYSTEM</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Overview</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Routes>
            <Route path="/overview" element={<Overview />}/>
            <Route path="/students" element={<StudentTable />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}