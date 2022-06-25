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

function OverviewStat(data, title, icon, style) {
  const formatFloor = (num1, num2) => {
    const formatedNum = Number((num1 / num2) * 100).toFixed(1);
    return formatedNum;
  };

  return (
    <StatisticCard bordered style={style}>
      <Row>
        <StatisticCardIcon span={6}>{icon}</StatisticCardIcon>
        <Col span={18} style={bgColor}>
          <h3 style={bgColor}>Student</h3>
          <h2 style={bgColor}>{data.data?.total}</h2>
          <Progress
            showInfo={false}
            size="small"
            strokeColor="white"
            trailColor="lightgreen"
            percent={
              100 - formatFloor(data.data?.lastMonthAdded, data.data?.total)
            }
          />
          <p>{`${
            formatFloor(data.data?.lastMonthAdded, data.data?.total) + "%"
          } Increase in 30 Days`}</p>
        </Col>
      </Row>
    </StatisticCard>
  );
}

export default function Overview() {
  const [overview, setOverview] = useState();

  const formatFloor = (num1, num2) => {
    const formatedNum = Number((num1 / num2) * 100).toFixed(1);
    return formatedNum;
  };

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
          <StatisticCard bordered style={{ background: "#1890ff" }}>
            <Row>
              <StatisticCardIcon span={6}>
                <SolutionOutlined style={iconStyle} />
              </StatisticCardIcon>
              <Col span={18} style={bgColor}>
                <h3 style={bgColor}>TOTAL STUDENTS</h3>
                <h2 style={bgColor}>{overview?.student?.total}</h2>
                <Progress
                  showInfo={false}
                  size="small"
                  strokeColor="white"
                  trailColor="lightgreen"
                  percent={
                    100 -
                    formatFloor(
                      overview?.student?.lastMonthAdded,
                      overview?.student?.total
                    )
                  }
                />
                <p>{`${
                  formatFloor(
                    overview?.student?.lastMonthAdded,
                    overview?.student?.total
                  ) + "%"
                } Increase in 30 Days`}</p>
              </Col>
            </Row>
          </StatisticCard>
        </Col>
        <Col span={8} style={statisticCol}>
          <StatisticCard bordered style={{ background: "#673bb7" }}>
            <Row>
              <StatisticCardIcon span={6}>
                <DeploymentUnitOutlined style={iconStyle} />
              </StatisticCardIcon>
              <Col span={18} style={bgColor}>
                <h3 style={bgColor}>TOTAL TEACHERS</h3>
                <h2 style={bgColor}>{overview?.teacher?.total}</h2>
                <Progress
                  showInfo={false}
                  size="small"
                  strokeColor="white"
                  trailColor="lightgreen"
                  percent={
                    100 -
                    formatFloor(
                      overview?.teacher?.lastMonthAdded,
                      overview?.teacher?.total
                    )
                  }
                />
                <p>{`${
                  formatFloor(
                    overview?.teacher?.lastMonthAdded,
                    overview?.teacher?.total
                  ) + "%"
                } Increase in 30 Days`}</p>
              </Col>
            </Row>
          </StatisticCard>
        </Col>
        <Col span={8} style={statisticCol}>
          <StatisticCard bordered style={{ background: "#ffaa16" }}>
            <Row>
              <StatisticCardIcon span={6}>
                <ReadOutlined style={iconStyle} />
              </StatisticCardIcon>
              <Col span={18} style={bgColor}>
                <h3 style={bgColor}>TOTAL COURSES</h3>
                <h2 style={bgColor}>{overview?.course?.total}</h2>
                <Progress
                  showInfo={false}
                  size="small"
                  strokeColor="white"
                  trailColor="lightgreen"
                  percent={
                    100 -
                    formatFloor(
                      overview?.course?.lastMonthAdded,
                      overview?.course?.total
                    )
                  }
                />
                <p>{`${
                  formatFloor(
                    overview?.course?.lastMonthAdded,
                    overview?.course?.total
                  ) + "%"
                } Increase in 30 Days`}</p>
              </Col>
            </Row>
          </StatisticCard>
        </Col>
      </Row>
    </>
  );
}
