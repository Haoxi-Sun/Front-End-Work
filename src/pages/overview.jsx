import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import {
  SolutionOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Col, Row, Card, Progress } from "antd";
import styled from "styled-components";
import { displayOverview } from "../api/api";

const statisticRow = {
  margin: "-8px -12px 8px",
};

const statisticCol = {
  padding: "8px 12px",
};

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

const iconStyle = {
  background: "rgb(255, 255, 255)",
  padding: "25px",
  borderRadius: "50%",
  color: "rgb(153, 153, 153)",
};

const bgColor = { color: "#fff" };

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

  useEffect(() => {
    displayOverview().then((res) => {
      if (res) {
        setOverview(res);
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
    </>
  );
}
