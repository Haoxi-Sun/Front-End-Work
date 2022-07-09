import React, { useState } from "react";
import "antd/dist/antd.min.css";
import SiderBar from "./siderBar";
import HeaderBar from "./header";
import { MenuFoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import { useLocation, Link, useRoutes, Outlet } from "react-router-dom";
import styled from "styled-components";
import RoutesList from "./routes";
const { Header, Sider, Content } = Layout;

const SiderStyle = styled(Layout.Sider)`
  overflow: auto;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
`;

const HeaderStyle = styled(Layout.Header)`
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  z-index: 10;
  padding: 0 0;
`;

const ContentStyle = styled(Layout.Content)`
  margin: 16px;
  padding: 24px;
  min-height: auto;
  background: #fff;
`;
const CollapsedStyle = styled.div`
  padding: 0 24px;
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
  color: #fff;
`;

export default function DashLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const routesTree = useRoutes(RoutesList);
  // Breadcrumb Test
  const location = useLocation();
  const path = location.pathname;
  const getBreadcrumb = () => {
    const splitPath = path
      .split("/")
      .filter((i) => i)
      .splice(1);
    const pathList = [];
    splitPath.map((item) => {
      let name = "";
      if (item === "overview" || item === "manager") {
        name = "Overview";
        pathList.push({
          path: path,
          name: name,
        });
      } else if (item === "students") {
        name = "Student";
        pathList.push({
          name: name,
          path: undefined,
        });
        pathList.push({
          path: path,
          name: "Student List",
        });
      } else {
        name = "Detail";
        pathList.push({
          path: path,
          name: name,
        });
      }
    });
    return pathList;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderStyle
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <SiderBar />
      </SiderStyle>
      <Layout className="site-layout">
        <HeaderStyle>
          <CollapsedStyle
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            onMouseOver={(event) => (event.target.style.color = "#1890ff")}
            onMouseOut={(event) => (event.target.style.color = "#fff")}
          >
            {collapsed ? <MenuFoldOutlined /> : <MenuFoldOutlined />}
          </CollapsedStyle>

          <HeaderBar />
        </HeaderStyle>

        <Breadcrumb style={{ margin: "0 16px", padding: "16px" }}>
          <Breadcrumb.Item>
            <a href="./overview">CMS MANAGER SYSTEM</a>
          </Breadcrumb.Item>
          {getBreadcrumb().map((item, index) => (
            <Breadcrumb.Item key={index}>
              {item.path ? (
                <Link to={item.path}>{item.name}</Link>
              ) : (
                <>{item.name}</>
              )}
            </Breadcrumb.Item>
          ))}
          {/* {
            RoutesList.map((item, index) =>{
              <Breadcrumb.Item key={`${item.label}_${index}`}>
                {
                  item.path ? <Link to={item.path}>{item.label}</Link> : <>{item.label}</>
                }
              </Breadcrumb.Item>
            })
          } */}
        </Breadcrumb>

        <ContentStyle>{routesTree}</ContentStyle>
      </Layout>
    </Layout>
  );
}
