import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Select,
  List,
  Avatar,
  Space,
  Spin,
  Menu,
  Badge,
  Dropdown,
  Tabs,
  Button,
  notification,
} from 'antd';
import styled from 'styled-components';
import { getMessages, messageEvent, markAsRead } from '../api/api';
import {
  UserOutlined,
  AlertOutlined,
  MessageOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { logout, getMessageStatistics } from '../api/api';
import { MessageStatisticsContent } from './messageProvider';
import { formatDistanceToNow } from 'date-fns';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;

const HeaderIcons = styled.span`
  font-size: 18px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  transition: color 0.3s ease 0s;
  margin-right: 2em;
`;

const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

function Messages({ type, message, onRead, clearAll }) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getMessages({ ...pagination, ...{ type: type } }).then((res) => {
      if (res) {
        setData([...data, ...res.messages]);
        setTotal(res.total);
      }
    });
  }, [pagination]);

  useEffect(() => {
    if (!!message && message.type === type) {
      setData([message, ...data]);
    }
  }, [message]);

  useEffect(() => {
    if (!!clearAll && clearAll === type && data) {
      const ids = data
        .filter((item) => item.status === 0)
        .map((item) => item.id);
      if (ids.length) {
        markAsRead({ ids: ids }).then((res) => {
          if (res) {
            setData(data.map((item) => ({ ...item, status: 1 })));
          }
          if (onRead) {
            onRead(ids.length);
          }
        });
      } else {
        message.warn(`All of these ${type}s has been marked as read!`);
      }
    }
  }, [clearAll]);

  return (
    <InfiniteScroll
      scrollableTarget={type}
      dataLength={data.length}
      next={() => setPagination({ ...pagination, page: pagination.page + 1 })}
      hasMore={data.length < total}
      loader={
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      }
      endMessage={<div>It is all, nothing more 🤐</div>}
      style={{ overflow: 'hidden' }}
    >
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => {
          return (
            <List.Item
              style={{ opacity: item.status ? 0.4 : 1 }}
              key={item?.createdAt}
              actions={[
                <Space key={item?.createdAt}>
                  {formatDistanceToNow(new Date(item?.createdAt), {
                    addSuffix: true,
                  })}
                </Space>,
              ]}
              extra={
                <Space>
                  {item?.type === 'notification' ? (
                    <AlertOutlined />
                  ) : (
                    <MessageOutlined />
                  )}
                </Space>
              }
              onClick={() => {
                if (item?.status === 1) return;
                markAsRead({ ids: [item?.id] }).then((res) => {
                  if (res) {
                    try {
                      const result = data.find((value) => value.id === item.id);

                      if (!!result) {
                        result.status = 1;
                      }
                    } catch (err) {
                      if (err) {
                        throw new Error('just end loop');
                      }
                    }
                    setData([...data]);
                  }
                  if (onRead) {
                    onRead(1);
                  }
                });
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item?.from?.nickname}
                description={item?.content}
              />
            </List.Item>
          );
        }}
      />
    </InfiniteScroll>
  );
}

export default function HeaderBar() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('notification');
  const [clean, setClean] = useState();
  const [message, setMessage] = useState();
  const { state, dispatch } = useContext(MessageStatisticsContent);

  useEffect(() => {
    getMessageStatistics().then((res) => {
      if (res) {
        const { receive } = res;
        dispatch({
          type: 'increment',
          payload: { type: 'message', count: receive.message.unread },
        });
        dispatch({
          type: 'increment',
          payload: { type: 'notification', count: receive.notification.unread },
        });
      }
    });

    const sse = messageEvent();
    sse.onmessage = (event) => {
      const eventData = JSON.parse(event.data || {});
      if (eventData.type !== 'heartbeat') {
        const content = eventData.content;
        if (content.type === 'message') {
          notification['info']({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }
        setMessage(content);
        dispatch({
          type: 'increment',
          payload: {
            type: content.type,
            count: 1,
          },
        });
      }
    };
    return () => {
      sse.close();
      dispatch({ type: 'reset' });
    };
  }, []);

  const handleClick = () => {
    logout().then((res) => {
      if (res) {
        navigate('/');
      }
    });
  };

  const logout_menu = (
    <Menu
      items={[
        {
          key: '1',
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
        <Badge size="small" offset={[-30, 0]} count={state.total}>
          <HeaderIcons>
            <Dropdown
              overlayStyle={{
                background: '#fff',
                borderRadius: 4,
                width: 400,
                height: 500,
                overflow: 'hidden',
              }}
              trigger={['click']}
              placement="bottomRight"
              overlay={
                <>
                  <Tabs
                    renderTabBar={(props, DefaultTabBar) => (
                      <TabNavContainer>
                        <DefaultTabBar
                          {...props}
                          defaultActiveKey="notification"
                        />
                      </TabNavContainer>
                    )}
                    onChange={(key) => {
                      if (key !== activeKey) {
                        setActiveKey(key);
                      }
                    }}
                    animated
                    defaultActiveKey="notification"
                    style={{ marginBottom: '0px', padding: '10px 20px 0px' }}
                  >
                    <TabPane
                      tab={`Notification (${state.notification})`}
                      key="notification"
                    >
                      <MessageContainer id="notification">
                        <Messages
                          type="notification"
                          message={message}
                          scrollTarget="notification"
                          clearAll={clean}
                          onRead={(count) =>
                            dispatch({
                              type: 'decrement',
                              payload: { type: 'notification', count },
                            })
                          }
                        />
                      </MessageContainer>
                    </TabPane>
                    <TabPane tab={`Message (${state.message})`} key="message">
                      <MessageContainer id="message">
                        <Messages
                          type="message"
                          scrollTarget="message"
                          message={message}
                          clearAll={clean}
                          onRead={(count) =>
                            dispatch({
                              type: 'decrement',
                              payload: { type: 'message', count },
                            })
                          }
                        />
                      </MessageContainer>
                    </TabPane>
                  </Tabs>
                  <Footer justify="space-between" align="middle">
                    <Col span={12}>
                      <Button onClick={() => setClean(activeKey)}>
                        Mark all as read
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button>
                        <a href={'/dashboard/message'}>View history</a>
                      </Button>
                    </Col>
                  </Footer>
                </>
              }
            >
              <BellOutlined style={{ fontSize: '24px', marginTop: '5px' }} />
            </Dropdown>
          </HeaderIcons>
        </Badge>
        <HeaderIcons>
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
