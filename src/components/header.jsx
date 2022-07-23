import React, { useEffect, useState } from 'react';
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

function Messages({ type, message }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);
  //status 1 - read , 0 -unread
  useEffect(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    getMessages({ ...pagination, ...{ type: type } }).then((res) => {
      if (res) {
        setData([...res.messages, ...data]);
        setTotal(res.total);
        setLoading(false);
      }
    });
  }, [pagination]);

  useEffect(() => {
    if (!!message && message.type === type) {
      setData([message, ...data]);
    }
  }, [message]);

  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        hasMore={data.length < total}
        loader={
          <div>
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
                  <Space key={item?.createdAt}>{item?.createdAt}</Space>,
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
                        const result = data.find(
                          (value) => value.id === item.id
                        );

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
    </>
  );
}

export default function HeaderBar() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('notification');
  const [notificationUnread, setNotificationUnread] = useState(0);
  const [messageUnread, setMessageUnread] = useState(0);
  const [message, setMessage] = useState();

  useEffect(() => {
    getMessageStatistics().then((res) => {
      if (res) {
        const { receive, sent } = res;
        setNotificationUnread(receive.notification.unread);
        setMessageUnread(receive.message.unread);
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
      }
    };
    return () => {
      sse.close();
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
        <Badge
          size="small"
          offset={[-30, 0]}
          count={notificationUnread + messageUnread}
        >
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
                      tab={`Notification (${notificationUnread})`}
                      key="notification"
                    >
                      <MessageContainer>
                        <Messages type="notification" message={message} />
                      </MessageContainer>
                    </TabPane>
                    <TabPane tab={`Message (${messageUnread})`} key="message">
                      <MessageContainer>
                        <Messages type="message" message={message} />
                      </MessageContainer>
                    </TabPane>
                  </Tabs>
                  <Footer justify="space-between" align="middle">
                    <Col span={12}>
                      <Button>Mark all as read</Button>
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
