import React from "react";
import "antd/dist/antd.min.css";
import styled from "styled-components";
import { Button, Col, Card, Row } from "antd";
import { HeartFilled, UserOutlined } from "@ant-design/icons";

const CardRow = styled(Row)`
  margin: -8px -3px 8px;
`;

const rowCol = {
  position: "relative",
};

const ColDetail = styled(Col)`
  padding: 8px 3px;
`;

const colIcon = {
  padding: "8px 3px",
  display: "flex",
  alignItems: "center",
};
const heartIcon = {
  marginRight: "5px",
  fontSize: "16px",
  color: "red",
};

const userIcon = {
  marginRight: "5px",
  fontSize: "16px",
  color: "rgb(24,144,255)",
};

const teacherStyle = {
  fontWeight: "bold",
};

export default function CourseCard({
  cover,
  name,
  startTime,
  star,
  duration,
  maxStudents,
  teacherName,
}) {
  return (
    <Card bordered cover={<img src={cover} style={{ height: "260px" }} />}>
      <CardRow>
        <h3>{name}</h3>
      </CardRow>
      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>{startTime}</ColDetail>
        <Col style={colIcon}>
          <HeartFilled style={heartIcon} />
          <b>{star}</b>
        </Col>
      </CardRow>
      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>Duration:</ColDetail>
        <ColDetail>
          <b>{duration} months</b>
        </ColDetail>
      </CardRow>
      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>Teacher:</ColDetail>
        <ColDetail style={teacherStyle}>
          <a>{teacherName}</a>
        </ColDetail>
      </CardRow>
      <CardRow align="middle" justify="space-between" style={rowCol}>
        <ColDetail>
          <UserOutlined style={userIcon} />
          <span>Student Limit:</span>
        </ColDetail>
        <ColDetail>
          <b>{maxStudents}</b>
        </ColDetail>
      </CardRow>
      <Button type="primary" href="#">
        Read More
      </Button>
    </Card>
  );
}
