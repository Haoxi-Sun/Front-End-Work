import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Row, Col, Card, Avatar, Tabs } from "antd";
import styled from "styled-components";
import { showStudentDetails } from "../api/api";
const { TabPane } = Tabs;

const Title = styled(Avatar)`
  width: 100px;
  height: 100px;
  display: block;
  margin: auto;
`;

const contentStyle = {
  padding: "8px 3 px",
  textAlign: "center",
};

export default function StudentDetails() {
  const id = useParams().id;
  const [data, setData] = useState();
  useEffect(() => {
    showStudentDetails(id).then((res) => {
      setData(res);
    });
  }, [id]);

 
  return (
    <>
      <Row>
        <Col span={8} style={{ padding: "8px 3px" }}>
          <Card title={<Title />}>
            <Row>
              <Col span={12} style={contentStyle}>
                <b>Name</b>
                <p>{data.name}</p>
              </Col>
              <Col span={12} style={contentStyle}>
                <b>Age</b>
                <p>{data.age}</p>
              </Col>
              <Col span={12} style={contentStyle}>
                <b>Email</b>
                <p>{data.email}</p>
              </Col>
              <Col span={12} style={contentStyle}>
                <b>Phone</b>
                <p>{data.phone}</p>
              </Col>
            </Row>
            <Row style={{ margin: "-8px -3px 8px" }}>
              <Col span={24} style={contentStyle}>
                <b>Address</b>
                <p></p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={15} offset={1}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1"></TabPane>
              <TabPane tab="Courses" key="2"></TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </>
  );
}
