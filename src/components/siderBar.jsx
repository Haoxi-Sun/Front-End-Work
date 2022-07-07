import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Menu } from "antd";
import styled from "styled-components";
import RoutesList from "./routes";
const { SubMenu } = Menu;
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
  const [openKeys, setOpenKeys] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(["Overview_0"]);
  const path = useLocation().pathname.split("/")[2];

  const handleOpenKey = (items) => {
    const latestOpenKey = items.find((key) => openKeys?.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(items);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleSelect = (item) => {
    setSelectedKeys(item.key);
  };
  const renderMenu = (data) => {
    return data.map((item, index) => {
      if (!item?.children) {
        if (item.label !== undefined) {
          return (
            <Menu.Item key={item.label + "_" + index} icon={item.icon}>
              <Link to={item.path}>
                <span>{item.label}</span>
              </Link>
            </Menu.Item>
          );
        }
      } else {
        rootSubmenuKeys.push(item.label + "_" + index);
        const foundItem = item.children.find(
          (foundItem) => path.indexOf(foundItem.label + "_" + index) === 0
        );
        if (foundItem) {
          setOpenKeys([item.label + "_" + index]);
        }
        return (
          <SubMenu
            key={item.label + "_" + index}
            icon={item.icon}
            title={item.label}
          >
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
    });
  };
  return (
    <>
      <LogoContainer>
        <Logo>CMS</Logo>
      </LogoContainer>
      <Menu
        onSelect={handleSelect}
        theme="dark"
        mode="inline"
        onOpenChange={handleOpenKey}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      >
        {renderMenu(RoutesList)}
      </Menu>
    </>
  );
}
