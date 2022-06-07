import React from "react";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";
import {
  MessageOutlined,
  ReadOutlined,
  DeploymentUnitOutlined,
  SolutionOutlined,
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import styled from "styled-components";
<style>
  @import
  url('https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto+Mono:wght@500&display=swap');
</style>;

const LogoContainer = styled.div`
  height: 64px;
  width: 100%;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotateX(45deg);
  text-shadow: 5px 1px 5px;
  font-family: "Roboto Mono", monospace;
`;

const Logo = styled.span`
  color: rgb(255, 255, 255);
  cursor: pointer;
`;

export default function SiderBar() {
  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const items = [
    getItem("Overview", "1", <DashboardOutlined />),
    getItem("Student", "sub1", <SolutionOutlined />, [
      getItem(
        "Student List",
        "2",
         // eslint-disable-next-line
        <a target="_blank" rel="noopener noreferrer">
          <TeamOutlined />
        </a>
      ),
    ]),
    getItem("Teacher", "sub2", <DeploymentUnitOutlined />, [
      getItem("Teacher List", "3", <TeamOutlined />),
    ]),
    getItem("Course", "sub3", <ReadOutlined />, [
      getItem("All Courses", "4", <ProjectOutlined />),
      getItem("Add Course", "5", <FileAddOutlined />),
      getItem("Edit Course", "6", <EditOutlined />),
    ]),
    getItem("Message", "7", <MessageOutlined />),
  ];

  const navigate = useNavigate();
  const handleMenuClick = (event) => {
    if (event.key === "1") {
      navigate('./');
    } else if (event.key === "2") {
      navigate('./students');
    }
  };

  return (
    <>
      <LogoContainer>
        <Logo>CMS</Logo>
      </LogoContainer>
      <Menu
        onClick={handleMenuClick}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
      />
    </>
  );
}
