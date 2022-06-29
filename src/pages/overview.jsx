import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import {
  SolutionOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Col, Row, Card, Progress, Select } from "antd";
import styled from "styled-components";
import { displayOverview, getStatistics } from "../api/api";
import Distribution from "../components/distribution";
import Pie from "../components/pieChart";
import Increment from "../components/increment";

const { Option } = Select;
const statisticRow = {
  margin: "-8px -12px 8px",
};

const statisticCol = {
  padding: "8px 12px",
};

const iconStyle = {
  background: "rgb(255, 255, 255)",
  padding: "25px",
  borderRadius: "50%",
  color: "rgb(153, 153, 153)",
};

const bgColor = { color: "#fff" };

const StatisticCard = styled(Card)`
  border-radius: 5px;
  cursor: pointer;
`;

const StatisticCardIcon = styled(Col)`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-size: 32px;
`;

function OverviewCard({ data, title, style, icon }) {
  const formatFloor = (num1, num2) => {
    const formatedNum = Number((num1 / num2) * 100).toFixed(1);
    return formatedNum;
  };

  return (
    <StatisticCard bordered style={style}>
      <Row>
        <StatisticCardIcon span={6}>{icon}</StatisticCardIcon>
        <Col span={18} style={bgColor}>
          <h3 style={bgColor}>{title}</h3>
          <h2 style={bgColor}>{data?.total}</h2>
          <Progress
            showInfo={false}
            size="small"
            strokeColor="white"
            trailColor="lightgreen"
            percent={100 - formatFloor(data?.lastMonthAdded, data?.total)}
          />
          <p>{`${
            formatFloor(data?.lastMonthAdded, data?.total) + "%"
          } Increase in 30 Days`}</p>
        </Col>
      </Row>
    </StatisticCard>
  );
}
export default function Overview() {
  const [overview, setOverview] = useState();
  const [studentStatistics, setStudentStatistics] = useState();
  const [teacherStatistics, setTeacherStatistics] = useState();
  const [courseStatistics, setCourseStatistics] = useState();
  const [distributionTitle, setDistributionTitle] = useState("student");
  const [typeTitle, setTypeTitle] = useState("studentType");
  useEffect(() => {
    displayOverview().then((res) => {
      if (res) {
        setOverview(res);
      }
    });

    getStatistics("student").then((res) => {
      if (res) {
        setStudentStatistics(res);
      }
    });
    getStatistics("teacher").then((res) => {
      if (res) {
        setTeacherStatistics(res);
      }
    });
    getStatistics("course").then((res) => {
      if (res) {
        setCourseStatistics(res);
      }
    });
  }, []);

  return (
    <>
      <Row style={statisticRow} align="middle">
        <Col span={8} style={statisticCol}>
          <OverviewCard
            title="TOTAL STUDENTS"
            data={overview?.student}
            style={{ background: "#1890ff" }}
            icon={<SolutionOutlined style={iconStyle} />}
          />
        </Col>
        <Col span={8} style={statisticCol}>
          <OverviewCard
            title="TOTAL TEACHERS"
            data={overview?.teacher}
            style={{ background: "#673bb7" }}
            icon={<DeploymentUnitOutlined style={iconStyle} />}
          />
        </Col>
        <Col span={8} style={statisticCol}>
          <OverviewCard
            title="TOTAL COURSES"
            data={overview?.course}
            style={{ background: "#ffaa16" }}
            icon={<ReadOutlined style={iconStyle} />}
          />
        </Col>
      </Row>
      <Row gutter={[8, 16]}>
        <Col span={12}>
          <Card
            bordered
            title="Distribution"
            extra={
              <Select
                defaultValue="Student"
                bordered={false}
                onChange={(value) => setDistributionTitle(value)}
              >
                <Option value="student">Student</Option>
                <Option value="teacher">Teacher</Option>
              </Select>
            }
          >
            <Distribution
              title={distributionTitle}
              data={
                distributionTitle === "student"
                  ? studentStatistics?.country
                  : teacherStatistics?.country
              }
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            bordered
            title="Types"
            extra={
              <Select
                defaultValue="studentType"
                bordered={false}
                onChange={(value) => setTypeTitle(value)}
              >
                <Option value="studentType">Student Type</Option>
                <Option value="courseType">Course Type</Option>
                <Option value="gender">Gender</Option>
              </Select>
            }
          >
            {typeTitle === "studentType" ? (
              <Pie data={studentStatistics?.type} title={typeTitle} />
            ) : typeTitle === "courseType" ? (
              <Pie data={courseStatistics?.type} title={typeTitle} />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <Pie
                    title="student gender"
                    data={Object.entries(overview.student.gender).map(
                      ([name, amount]) => ({
                        name,
                        amount,
                      })
                    )}
                  />
                </Col>
                <Col span={12}>
                  <Pie
                    title="teacher gender"
                    data={Object.entries(overview.teacher.gender).map(
                      ([name, amount]) => ({
                        name,
                        amount,
                      })
                    )}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[8, 16]}>
        <Col span={12}>
          <Card bordered title="Increment">
            <Increment
              data={{
                student: studentStatistics?.createdAt,
                teacher: teacherStatistics?.createdAt,
                course: courseStatistics?.createdAt,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered title="Languages"></Card>
        </Col>
      </Row>
    </>
  );
}
