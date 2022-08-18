import React from 'react';
import StudentTable from '../../pages/manager/students';
import Overview from '../../pages/manager/overview';
import StudentDetails from '../../pages/manager/studentDetails';
import Courses from '../../pages/manager/courses';
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
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import CourseDetails from '../../pages/manager/courseDetails';
import Message from '../../pages/manager/message';
import AddCourse from '../../pages/manager/addCourse';
import EditCourse from '../../pages/manager/editCourse';
import Teachers from '../../pages/manager/teachers';

const managerRoutes = [
  {
    path: 'manager/overview',
    label: 'Overview',
    icon: <DashboardOutlined />,
    element: <Overview />,
  },
  {
    path: '',
    label: 'Student',
    icon: <SolutionOutlined />,
    element: <Outlet />,
    children: [
      {
        path: 'manager/students',
        label: 'Student List',
        icon: <TeamOutlined />,
        element: <StudentTable />,
      },
      {
        path: 'manager/students/:id',
        label: 'Detail',
        element: <StudentDetails />,
      },
    ],
  },
  {
    label: 'Teacher',
    icon: <DeploymentUnitOutlined />,
    children: [
      {
        path: 'manager/teachers',
        element: <Teachers />,
        label: 'Teacher List',
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    label: 'Course',
    icon: <ReadOutlined />,
    element: <Outlet />,
    children: [
      {
        path: 'manager/courses',
        label: 'All Courses',
        icon: <ProjectOutlined />,
        element: <Courses />,
      },
      {
        path: 'manager/courses/:id',
        label: 'Detail',
        element: <CourseDetails />,
      },
      {
        path: 'manager/courses/add-course',
        label: 'Add Course',
        element: <AddCourse />,
        icon: <FileAddOutlined />,
      },
      {
        path: 'manager/courses/edit-course',
        label: 'Edit Course',
        icon: <EditOutlined />,
        element: <EditCourse />,
      },
    ],
  },
  {
    label: 'Message',
    path: 'manager/message',
    icon: <MessageOutlined />,
    element: <Message />
  },
];

export default managerRoutes;
