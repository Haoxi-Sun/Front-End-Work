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
    icon: <DashboardOutlined />,
    element: <Overview />,
  },
  {
    path: "",
    label: "Student",
    icon: <SolutionOutlined />,
    element: <Outlet />,
    children: [
      {
        path: "students",
        label: "Student List",
        icon: <TeamOutlined />,
        element: <StudentTable />,
      },
      {
        path: "students/:id",
        element: <StudentDetails />,
      },
    ],
  },
  {
    label: "Teacher",
    icon: <DeploymentUnitOutlined />,
    children: [
      {
        path: "overview",
        label: "Teacher List",
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    label: "Course",
    icon: <ReadOutlined />,
    children: [
      {
        path: "overview",
        label: "All Courses",
        icon: <ProjectOutlined />,
      },
      {
        path: "overview",
        label: "Add Course",
        icon: <FileAddOutlined />,
      },
      {
        path: "overview",
        label: "Edit Course",
        icon: <EditOutlined />,
      },
    ],
  },
  {
    label: "Message",
    path: "overview",
    icon: <MessageOutlined />,
  },
];

export default RoutesList;
