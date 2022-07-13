import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Menu } from "antd";
import styled from "styled-components";
import routesList from "./managerRoutes";
const { SubMenu } = Menu;

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

const generateKey = (item, index) => {
  return `${item.label}_${index}`;
};

let selectedKeys = null;
let submenuKeys = [];
let openKeys = [];
const getDefaultKeys = (routesList, path) => {
  routesList.forEach((item, index) => {
    if (!item.children) {
      if (item.path === path) {
        selectedKeys = generateKey(item, index);
      }
    } else {
      submenuKeys.push(generateKey(item, index));
      const foundItem = item.children.find((foundItem) => {
        if (foundItem.path === path) {
          return true;
        }
      });
      if (foundItem) {
        openKeys.push(generateKey(item, index));
      }
      getDefaultKeys(item.children, path);
    }
  });
  return [selectedKeys, openKeys, submenuKeys];
};

export default function SiderBar() {
  const path = useLocation().pathname.split("/")[2];

  const [sKeys, oKeys, rKeys] = getDefaultKeys(routesList, path);
  const defaultSelectedKeys = [sKeys];
  const [defaultOpenKeys, setDefaultOpenKeys] = useState(oKeys);
  const rootSubmenuKeys = rKeys;

  const renderMenu = (data) => {
    return data.map((item, index) => {
      const itemKey = generateKey(item, index);
      if (!item?.children) {
        if (item.label !== "Detail") {
          return (
            <Menu.Item key={itemKey} icon={item.icon}>
              <Link to={item.path}>
                <span>{item.label}</span>
              </Link>
            </Menu.Item>
          );
        }
      } else {
        return (
          <SubMenu key={itemKey} icon={item.icon} title={item.label}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
    });
  };
  console.log("defaultOpenKeys", defaultOpenKeys);
  return (
    <>
      <LogoContainer>
        <Logo>CMS</Logo>
      </LogoContainer>
      <Menu
        theme="dark"
        mode="inline"
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
      >
        {renderMenu(routesList)}
      </Menu>
    </>
  );
}
