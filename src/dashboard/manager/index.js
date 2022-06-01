import React, { useState } from "react";
import "antd/dist/antd.min.css";
import SiderBar from "../../components/siderBar";
import HeaderBar from "../../components/header";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import styled from "styled-components";
const { Header, Sider, Content } = Layout;

export default function Manager() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
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
            <a href="../../dashboard/manager">CMS MANAGER SYSTEM</a>
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
        ></Content>
      </Layout>
    </Layout>
  );
}
