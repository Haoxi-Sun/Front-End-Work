import React, { useEffect, useState, useContext } from 'react';
import { flatten } from 'lodash';
import 'antd/dist/antd.min.css';
import { Row, Col, Typography, Select, List, Avatar, Space, Spin } from 'antd';
import styled from 'styled-components';
import { getMessages, markAsRead } from '../api/api';
import {
  UserOutlined,
  MessageOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageStatisticsContent } from '../components/messageProvider';
import { format } from 'date-fns';
const { Title } = Typography;
const { Option } = Select;

const selectorColStyle = {
  textAlign: 'right',
};

const selectorStyle = {
  width: '120px',
};

export default function Message() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [type, setType] = useState(null);
  const [total, setTotal] = useState(0);
  const { dispatch } = useContext(MessageStatisticsContent);

  useEffect(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    getMessages({ ...pagination, ...{ type: type } }).then((res) => {
      if (res) {
        setData([...data, ...res.messages]);
        setTotal(res.total);
        setLoading(false);
      }
    });
  }, [pagination, type]);

  return (
    <>
      <Row align="middle" style={{ position: 'sticky' }}>
        <Col span={8}>
          <Title level={2}>Recent Messages</Title>
        </Col>
        <Col span={8} offset={8} style={selectorColStyle}>
          <Select
            defaultValue={null}
            style={selectorStyle}
            onSelect={(value) => {
              setType(value);
              setPagination({ ...pagination, page: 1 });
              setData([]);
            }}
          >
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
            renderItem={(item) => (
              <>
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
                          const result = values.find(
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
                        setDataSource([...dataSource]);
                        dispatch({
                          type: 'decrement',
                          payload: { count: 1, type: item.type },
                        });
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
              </>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  );
}
