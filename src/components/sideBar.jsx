import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import { Menu } from 'antd';
import styled from 'styled-components';
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
  font-family: 'Roboto Mono', monospace;
`;

const Logo = styled.span`
  color: rgb(255, 255, 255);
  cursor: pointer;
`;

const generateKey = (item, index) => {
  return `${item.label}_${index}`;
};

const generatePath = (item) => {
  if (item.path) return item.path;
};

const isDetailPath = (path) => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /^\d{1,}$/;
  return reg.test(last);
};

const omitDetailPath = (path) => {
  const isDetail = isDetailPath(path);
  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
};

const generateFactory = (fn) => {
  return function inner(data, current = '') {
    const keys = data.map((item, index) => {
      let key = fn(item, index);
      if (current) {
        key = [current, key].join('/');
      }
      if (item.children && !!item.children.length) {
        return inner(item.children, key).flat();
      } else {
        return [key];
      }
    });
    return keys;
  };
};

const getKeyPathInfo = (data) => {
  const getPaths = generateFactory(generatePath);
  const paths = getPaths(data)
    .flat()
    .map((item) => ['/dashboard', item].filter((item) => !!item).join('/'));
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).flat();
  return { keys, paths };
};

const isPathEqual = (target) => (current) => {
  current = current.endsWith('/') ? current.slice(0, -1) : current;
  return current === target;
};

const getRootSubmenuKeys = (data) => {
  let keys = [];
  data.forEach((item, index) => {
    if (item.children && !!item.children.length) {
      keys.push(generateKey(item, index));
    }
  });
  return keys;
};

export default function SideBar({routesList}) {
  const path = useLocation().pathname;
  const activeRoutes = omitDetailPath(path);
  const { keys, paths } = getKeyPathInfo(routesList);
  const isEqual = isPathEqual(activeRoutes);
  const index = paths.findIndex(isEqual);

  const rootSubmenuKeys = getRootSubmenuKeys(routesList);

  const defaultOpenKeys = keys[index]
    ? keys[index].split('/').slice(0, -1)
    : [''];
  const defaultSelectedKeys = keys[index]
    ? [keys[index].split('/').pop()]
    : [''];

  const [openKeys, setOpenKeys] = useState(defaultOpenKeys);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const renderMenu = (data) => {
    return data.map((item, index) => {
      const itemKey = generateKey(item, index);
      if (!item?.children) {
        if (item.label !== 'Detail') {
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
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {renderMenu(routesList)}
      </Menu>
    </>
  );
}
