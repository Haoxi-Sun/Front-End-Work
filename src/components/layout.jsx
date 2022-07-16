import React, { useState } from "react";
import "antd/dist/antd.min.css";
import SiderBar from "./siderBar";
import HeaderBar from "./header";
import { MenuFoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import { useLocation, useRoutes } from "react-router-dom";
import styled from "styled-components";
import routesList from "./managerRoutes";
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

/**
 * overview /
 * overview, students, students/:id
 * @param {*} value
 * @returns
 */
const predicateFn = (data, value) => data.path === value;

const generateKey = (item, index) => {
  return `${item.label}_${index}`;
};

const isDetailPath = (path) => {
  const paths = path.split("/");
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /^\d{1,}$/;
  return reg.test(last);
};
const deepSearchRecordFactory = (predicateFn, value, key) => {
  return function search(data, record) {
    const headNode = data.slice(0, 1)[0];
    const restNodes = data.slice(1);

    record.push(headNode);
    if (predicateFn(headNode, value)) {
      return record;
    }
    if (headNode[key]) {
      const res = search(headNode[key], record);

      if (res) {
        return record;
      } else {
        record.pop();
      }
    }

    if (restNodes.length) {
      record.pop();

      const res = search(restNodes, record);

      if (res) {
        return record;
      }
    }

    return null;
  };
};
export default function DashLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const routesTree = useRoutes(routesList);
  const location = useLocation();
  const path = location.pathname;
  const splitPath = path.split("/").slice(1);
  const root = splitPath.slice(1, 3).join("/");
  const filteredPath = isDetailPath(root) ? "students/:id" : root;

  const deep_1 = deepSearchRecordFactory(predicateFn, filteredPath, "children");
  const recorder = deep_1(routesList, []);

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
          {recorder.map((item, index) => {
            const key = generateKey(item, index);
            if (item.path === "students/:id") {
              return (
                <>
                  <Breadcrumb.Item key="Student List_0">
                    <a href="../students">Student List</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item key={"Detail_1"}>Detail</Breadcrumb.Item>
                </>
              );
            }
            return (
              <Breadcrumb.Item key={key}>
                {item.path ? (
                  <a href={item.path}>{item.label}</a>
                ) : (
                  <>{item.label}</>
                )}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <ContentStyle>{routesTree}</ContentStyle>
      </Layout>
    </Layout>
  );
}
