import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Menu } from "antd";
import styled from "styled-components";
import RoutesList from "./routes";
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

export default function SiderBar() {
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const [defaultSelectedKey, setDefaultSelectedKey] = useState([]);
  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    setDefaultSelectedKey([]);
    const getDefaultSelectedKey = (RoutesList) => {
      RoutesList.forEach((item, index) => {
        if (!item.children) {
          if (item.path === path) {
            defaultSelectedKey.push(generateKey(item, index));
          }
        } else {
          rootSubmenuKeys.push(generateKey(item, index));
          const foundItem = item.children.find((foundItem) => {
            if (foundItem.path === path) {
              return true;
            }
          });
          if (foundItem) {
            setDefaultOpenKeys([generateKey(item, index)]);
          }
          getDefaultSelectedKey(item.children);
        }
      });
    };
    getDefaultSelectedKey(RoutesList);
  }, [path]);

  const handleOpenKey = (items) => {
    const latestOpenKey = items.find(
      (key) => defaultOpenKeys?.indexOf(key) === -1
    );
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setDefaultOpenKeys(items);
    } else {
      setDefaultOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

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
  return (
    <>
      <LogoContainer>
        <Logo>CMS</Logo>
      </LogoContainer>
      <Menu
        theme="dark"
        mode="inline"
        onOpenChange={handleOpenKey}
        defaultOpenKeys={defaultOpenKeys}
        openKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKey}
      >
        {renderMenu(RoutesList)}
      </Menu>
    </>
  );
}
