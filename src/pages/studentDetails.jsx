import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Row, Col, Card, Avatar, Tabs, Tag, Table } from "antd";
import styled from "styled-components";
import { getStudentDetails } from "../api/api";
const { TabPane } = Tabs;

const Title = styled(Avatar)`
  width: 100px;
  height: 100px;
  display: block;
  margin: auto;
`;

const Part = styled.h3`
  color: rgb(115, 86, 241);
  margin: 20px 0px;
  font-size: 24px;
`;
const Line = styled.b`
  margin-right: 16px;
  min-width: 150px;
  display: inline-block;
`;
const contentStyle = {
  padding: "8px 3 px",
  textAlign: "center",
};

const rowStyle = {
  margin: "-8px -3px 8px",
};

const colStyle = {
  padding: "8px 3px",
};
export default function StudentDetails() {
  const id = useParams().id;
  const [data, setData] = useState();
  
  useEffect(() => {
    getStudentDetails(id).then((res) => {
      setData(res);
    });
  }, []);

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <a>
          {record.name}
        </a>
      ),
    },
    {
      title:"Type",
      dataIndex: "type",
      render: (type) => type.map((item) => item).join(","),
    },
    {
      title:"Join Time",
      dataIndex: "createdAt",
    }
  ];

  return (
    <>
      <Row>
        <Col span={8} style={{ padding: "8px 3px" }}>
          <Card title={<Title />}>
            <Row>
              <Col span={12} style={contentStyle}>
                <b>Name</b>
                <p>{data?.name}</p>
              </Col>
              <Col span={12} style={contentStyle}>
                <b>Age</b>
                <p>{data?.age}</p>
              </Col>
              <Col span={12} style={contentStyle}>
                <b>Email</b>
                <p>{data?.email}</p>
              </Col>
              <Col span={12} style={contentStyle}>
                <b>Phone</b>
                <p>{data?.phone}</p>
              </Col>
            </Row>
            <Row style={rowStyle}>
              <Col span={24} style={contentStyle}>
                <b>Address</b>
                <p>{data?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={15} offset={1}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <Part>Information</Part>
                <Row style={rowStyle}>
                  <Col span={24} style={colStyle}>
                    <Line>Education:</Line>
                    <span>{data?.education}</span>
                  </Col>
                  <Col span={24} style={colStyle}>
                    <Line>Area:</Line>
                    <span>{data?.country}</span>
                  </Col>
                  <Col span={24} style={colStyle}>
                    <Line>Gender:</Line>
                    <span>{data?.gender === 1 ? "Male" : "Female"}</span>
                  </Col>
                  <Col span={24} style={colStyle}>
                    <Line>Member Period:</Line>
                    <span>
                      {data?.memberStartAt} - {data?.memberEndAt}
                    </span>
                  </Col>
                  <Col span={24} style={colStyle}>
                    <Line>Type:</Line>
                    <span>{data?.type?.name}</span>
                  </Col>
                  <Col span={24} style={colStyle}>
                    <Line>Create Time:</Line>
                    <span>{data?.createdAt}</span>
                  </Col>
                  <Col span={24} style={colStyle}>
                    <Line>Update Time:</Line>
                    <span>{data?.updatedAt}</span>
                  </Col>
                </Row>
                <Part>Interesting</Part>
                <Row style={rowStyle}>
                  <Col span={24} style={{ padding: "5px 10px" }}>
                    {data?.interest.map((item, index) => (
                      <Tag color="magenta" key={index}>
                        {item}
                      </Tag>
                    ))}
                  </Col>
                </Row>
                <Part>Description</Part>
                <Row style={rowStyle}>
                  <Col style={colStyle}>{data?.description}</Col>
                </Row>
              </TabPane>
              <TabPane tab="Courses" key="2">
                <Table columns={columns} rowKey="id" dataSource={data?.courses}/>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </>
  );
}
