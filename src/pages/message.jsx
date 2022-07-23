import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import {
  Row,
  Col,
  Typography,
  Select,
  List,
  Avatar,
  Space,
  Spin,
  message,
} from 'antd';
import styled from 'styled-components';
import { getMessages, markAsRead } from '../api/api';
import {
  UserOutlined,
  MessageOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Title } = Typography;
const { Option } = Select;

const selectorColStyle = {
  textAlign: 'right',
};

const Indicator = styled.div`
  position: relative;
  left: 50%;
  margin-top: 10px;
  transform: translateX(50%);
`;

const selectorStyle = {
  width: '120px',
};

export default function Message() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    getMessages(pagination).then((res) => {
      if (res) {
        setData([...data, ...res.messages]);
        setTotal(res.total);
        setLoading(false);
      }
    });
  }, [pagination]);
  return (
    <>
      <Row align="middle" style={{ position: 'sticky' }}>
        <Col span={8}>
          <Title level={2}>Recent Messages</Title>
        </Col>
        <Col span={8} offset={8} style={selectorColStyle}>
          <Select defaultValue={null} style={selectorStyle}>
            <Option value={null}>All</Option>
            <Option value="notification">Notification</Option>
            <Option value="message">Message</Option>
          </Select>
        </Col>
      </Row>
      <div
        style={{ padding: '0 20px', overflowY: 'scroll', maxHeight: '75vh' }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={() =>
            setPagination({ ...pagination, page: pagination.page + 1 })
          }
          hasMore={data.length < total}
          loader={
            <Indicator>
              <Spin size="large" />
            </Indicator>
          }
          endMessage={<Indicator>It is all, nothing more 🤐</Indicator>}
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
                      {item?.type === 'message' ? (
                        <MessageOutlined />
                      ) : (
                        <AlertOutlined />
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
      </div>
    </>
  );
}
