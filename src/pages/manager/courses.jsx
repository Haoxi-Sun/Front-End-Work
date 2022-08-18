import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { BackTop, List, Spin, Button } from 'antd';
import { getCourses } from '../../api/api';
import CourseCard from '../../components/manager/courseCard';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

const Indicator = styled.div`
  position: relative;
  left: 50%;
  margin-top: 10px;
  transform: translateX(50%);
`;

const backTopIcon = {
  position: 'fixed',
  bottom: '50px',
  right: '15px',
  zIndex: '999',
  fontSize: '40px',
  color: 'rgb(255, 255, 255)',
  padding: '5px',
  background: 'rgba(0, 0, 0, 0.3)',
  opacity: '0.5',
  transition: 'all 0.5s ease 0s',
};

export default function Courses() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getCourses(pagination).then((res) => {
      if (res) {
        setTotal(res.total);
        setData([...data, ...res.courses]);
      }
    });
  }, [pagination]);

  return (
    <>
      <InfiniteScroll
        next={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        hasMore={data.length < total}
        dataLength={data.length}
        loader={
          <Indicator>
            <Spin size="large" />
          </Indicator>
        }
        endMessage={<Indicator>No More Course!</Indicator>}
        style={{ overflow: 'hidden' }}
      >
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={data}
          renderItem={(item) => {
            return (
              <List.Item key={item.id}>
                <CourseCard
                  course={item}
                  details={
                    <Link to={`${item.id}`}>
                      <Button type="primary">Read More</Button>
                    </Link>
                  }
                />
              </List.Item>
            );
          }}
        ></List>
      </InfiniteScroll>
      <BackTop visibilityHeight={10}>
        <div style={backTopIcon}>
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </>
  );
}
