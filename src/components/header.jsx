import React from "react";
import "antd/dist/antd.min.css";
import { BellOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Menu, message, Row } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../api/api";
const HeaderIcons = styled.span`
  font-size: 18px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  transition: color 0.3s ease 0s;
`;

export default function HeaderBar() {
  const navigate = useNavigate();
  const handleClick = () => {
    logout().then((res) => {
      if (res) {
        navigate("/");
      }
    });
  };

  const logout_menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              <LogoutOutlined /> Logout
            </a>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <Row align="middle">
        <Badge>
          <HeaderIcons>
            <BellOutlined style={{ fontSize: "24px", marginTop: "5px" }} />
          </HeaderIcons>
        </Badge>
        <HeaderIcons style={{ marginLeft: "2em" }}>
          <Dropdown
            overlay={logout_menu}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Avatar icon={<UserOutlined />} />
          </Dropdown>
        </HeaderIcons>
      </Row>
    </>
  );
}
