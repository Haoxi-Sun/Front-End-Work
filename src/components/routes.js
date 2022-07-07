import React from "react";
import StudentTable from "../pages/students";
import Overview from "../pages/overview";
import StudentDetails from "../pages/studentDetails";
import {
  MessageOutlined,
  ReadOutlined,
  DeploymentUnitOutlined,
  SolutionOutlined,
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const RoutesList = [
  {
    path: "overview",
    label: "Overview",
    key: "1",
    icon: <DashboardOutlined />,
    element: <Overview />,
  },
  {
    path: "",
    label: "Student",
    key: "sub1",
    icon: <SolutionOutlined />,
    element: <Outlet />,
    children: [
      {
        path: "students",
        label: "Student List",
        key: "2",
        icon: <TeamOutlined />,
        element: <StudentTable />,
      },
      {
        path: "students/:id",
        key:"3",
        element: <StudentDetails />,
      },
    ],
  },
  {
    label: "Teacher",
    key: "sub2",
    icon: <DeploymentUnitOutlined />,
    children: [
      {
        key: "4",
        path: "overview",
        label: "Teacher List",
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    label: "Course",
    key: "sub3",
    icon: <ReadOutlined />,
    children: [
      {
        key: "5",
        path: "overview",
        label: "All Courses",
        icon: <ProjectOutlined />,
      },
      {
        key: "6",
        path: "overview",
        label: "Add Course",
        icon: <FileAddOutlined />,
      },
      {
        key: "7",
        path: "overview",
        label: "Edit Course",
        icon: <EditOutlined />,
      },
    ],
  },
  {
    label: "Message",
    key: "8",
    path: "overview",
    icon: <MessageOutlined />,
  },
];

export default RoutesList;
