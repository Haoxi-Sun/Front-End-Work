import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Badge, Table, Collapse, Tag, Steps } from 'antd';
import styled from 'styled-components';
import { getCourseDetails } from '../../api/api';
import CourseCard from '../../components/manager/courseCard';

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const courseStatus = ['finished', 'processing', 'pending'];

const courseStatusColors = ['default', 'green', 'orange'];

const DetailRow = styled(Row)`
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;

const DetailCol = styled(Col)`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-bottom: none;
  :last-child {
    border-right: none;
  }
  p {
    margin-bottom: 0;
    padding-bottom: 5px;
  }
  b {
    color: #7356f1;
    font-size: 24px;
  }
`;

const styleCol = {
  padding: '8px 3px',
};

const StyledH2 = styled.h2`
  color: #7356f1;
`;

const StyledH3 = styled.h3`
  margin: 1em 0px;
`;

const StepsRow = styled(Row)`
  overflow-x: scroll;
  .ant-steps-item-title {
    text-overflow: ellipsis ' [..]';
    overflow: hidden;
  }
`;

const getCurrentItem = (data) => {
  return data?.schedule.chapters.findIndex(
    (item) => item.id === data?.schedule.current
  );
};

const getChapterExtra = (data, index) => {
  const activeIndex = getCurrentItem(data);
  const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;
  return <Tag color={courseStatusColors[status]}>{courseStatus[status]}</Tag>;
};

export default function CourseDetails() {
  const id = useParams().id;
  const [data, setData] = useState();
  const [courseInfo, setCourseInfo] = useState([]);

  const dataSource = new Array(1).fill({ id: 0 });
  const columns = weekdays.map((title, index) => {
    const target =
      data?.schedule?.classTime?.find((item) =>
        item.toLowerCase().includes(title.toLowerCase())
      ) || '';
    return { title, key: index, render: () => target.split(' ')[1] };
  });

  useEffect(() => {
    getCourseDetails({ id: id }).then((res) => {
      if (res) {
        const sales = res.sales;
        setCourseInfo([
          {
            label: 'Price',
            value: sales.price,
          },
          {
            label: 'Batches',
            value: sales.batches,
          },
          {
            label: 'Students',
            value: sales.studentAmount,
          },
          {
            label: 'Earings',
            value: sales.earnings,
          },
        ]);
        setData(res);
      }
    });
  }, []);

  return (
    <>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseCard
            style={{ paddingBottom: '0px' }}
            course={data}
            details={
              <DetailRow
                gutter={[6, 16]}
                justify="space-between"
                align="middle"
              >
                {courseInfo.map((item, index) => {
                  return (
                    <DetailCol span={6} key={index}>
                      <b>{item.value}</b>
                      <p>{item.label}</p>
                    </DetailCol>
                  );
                })}
              </DetailRow>
            }
          ></CourseCard>
        </Col>

        <Col span={15} offset={1} style={{ styleCol }}>
          <Card bordered>
            <StyledH2>Course Detail</StyledH2>

            <StyledH3>Create Time</StyledH3>
            <Row>{data?.createdAt}</Row>

            <StyledH3>Start Time</StyledH3>
            <Row>{data?.startTime}</Row>

            <Badge status="success" dot={true} offset={[5, 24]}>
              <StyledH3>Status</StyledH3>
            </Badge>

            <StepsRow>
              <Steps
                size="small"
                current={getCurrentItem(data)}
                style={{ width: 'auto' }}
              >
                {data?.schedule.chapters.map((item) => {
                  return (
                    <Steps.Step title={item.name} key={item.id}></Steps.Step>
                  );
                })}
              </Steps>
            </StepsRow>
            <StyledH3>Course Code</StyledH3>
            <Row>{data?.uid}</Row>

            <StyledH3>Class Time</StyledH3>
            <Table
              rowKey="id"
              bordered
              size="small"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            ></Table>

            <StyledH3>Category</StyledH3>
            <Row>
              {data?.type.map((item) => (
                <Tag
                  color={colors[Math.floor(Math.random() * colors.length)]}
                  key={item.id}
                >
                  {item.name}
                </Tag>
              ))}
            </Row>

            <StyledH3>Description</StyledH3>
            <Row>{data?.detail}</Row>

            <StyledH3>Chapter</StyledH3>
            <Collapse defaultActiveKey={getCurrentItem(data)}>
              {data?.schedule.chapters.map((chapter, index) => {
                return (
                  <Collapse.Panel
                    header={chapter.name}
                    key={chapter.id}
                    extra={getChapterExtra(data, index)}
                  >
                    <p>{chapter.content}</p>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </Card>
        </Col>
      </Row>
    </>
  );
}
