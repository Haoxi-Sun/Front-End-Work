import React, { useEffect, useState, useContext } from 'react';
import 'antd/dist/antd.min.css';
import { Row, Col, Typography, Select, List, Avatar, Space, Spin } from 'antd';
import { getMessages, markAsRead } from '../../api/api';
import {
  UserOutlined,
  MessageOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageStatisticsContent } from '../../components/manager/messageProvider';
import { format } from 'date-fns';
import { flatten } from 'lodash';

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
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [type, setType] = useState(null);
  const [total, setTotal] = useState(0);
  const { dispatch } = useContext(MessageStatisticsContent);
  const [source, setSource] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getMessages({ ...pagination, ...{ type: type } }).then((res) => {
      if (res) {
        setData((pre) => [...pre, ...res.messages]);
        setTotal(res.total);
      }
    });
  }, [pagination, type]);

  useEffect(() => {
    const result = data.reduce((acc, cur) => {
      const key = format(new Date(cur.createdAt), 'yyyy-MM-dd');
      if (!acc[key]) {
        acc[key] = [cur];
      } else {
        acc[key].push(cur);
      }
      return acc;
    }, []);

    const flattenData = Object.entries(result).sort(
      (pre, next) => new Date(next[0]).getTime() - new Date(pre[0]).getTime()
    );

    setSource(result);
    setDataSource(flattenData);
  }, [data]);
  return (
    <>
      <Row align="middle" style={{ position: 'sticky' }}>
        <Col span={8}>
          <Title level={2} style={{left: '10px'}}>Recent Messages</Title>
        </Col>
        <Col span={8} offset={8} style={selectorColStyle}>
          <Select
            defaultValue={null}
            style={selectorStyle}
            onSelect={(value) => {
              setType(value);
              setPagination({ ...pagination, page: 1 });
              setData([]);
              setDataSource([]);
              setSource([]);
            }}
          >
            <Option value={null}>All</Option>
            <Option value="notification">Notification</Option>
            <Option value="message">Message</Option>
          </Select>
        </Col>
      </Row>
      <div
        id="scrollDiv"
        style={{ maxHeight: '75vh', padding: '0 20px', overflowY: 'scroll' }}
      >
        <InfiniteScroll
          dataLength={flatten(Object.values(source)).length}
          scrollableTarget="scrollDiv"
          next={() =>
            setPagination({ ...pagination, page: pagination.page + 1 })
          }
          hasMore={flatten(Object.values(source)).length < total}
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
            dataSource={dataSource}
            renderItem={([date, values]) => (
              <>
                <Space size="large">
                  <Typography.Title level={4}>{date}</Typography.Title>
                </Space>
                {values.map((item) => (
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
                            dataSource.forEach(([_, values]) => {
                              const result = values.find(
                                (value) => value.id === item.id
                              );

                              if (!!result) {
                                result.status = 1;
                              }
                            });
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
                ))}
              </>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  );
}
