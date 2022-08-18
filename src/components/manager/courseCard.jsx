import React from 'react';
import 'antd/dist/antd.min.css';
import styled from 'styled-components';
import { Col, Card, Row } from 'antd';
import { HeartFilled, UserOutlined } from '@ant-design/icons';

const CardRow = styled(Row)`
  margin: -8px -3px 8px;
`;

const rowCol = {
  position: 'relative',
};

const ColDetail = styled(Col)`
  padding: 8px 3px;
`;

const colIcon = {
  padding: '8px 3px',
  display: 'flex',
  alignItems: 'center',
};

const heartIcon = {
  marginRight: '5px',
  fontSize: '16px',
  color: 'red',
};

const userIcon = {
  marginRight: '5px',
  fontSize: '16px',
  color: 'rgb(24,144,255)',
};

const teacherStyle = {
  fontWeight: 'bold',
};

export default function CourseCard({ course, details, style }) {

  return (
    <Card
      bordered
      cover={<img src={course?.cover} style={{ height: '260px' }} />}
      bodyStyle={style ? style : {}}
    >
      <CardRow>
        <h3>{course?.name}</h3>
      </CardRow>

      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>{course?.startTime}</ColDetail>
        <Col style={colIcon}>
          <HeartFilled style={heartIcon} />
          <b>{course?.star}</b>
        </Col>
      </CardRow>

      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>Duration:</ColDetail>
        <ColDetail>
          <b>{course?.duration} months</b>
        </ColDetail>
      </CardRow>

      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>Teacher:</ColDetail>
        <ColDetail style={teacherStyle}>
          <a>{course?.teacherName}</a>
        </ColDetail>
      </CardRow>

      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>
          <UserOutlined style={userIcon} />
          <span>Student Limit:</span>
        </ColDetail>
        <ColDetail>
          <b>{course?.maxStudents}</b>
        </ColDetail>
      </CardRow>
      {details}
    </Card>
  );
}
