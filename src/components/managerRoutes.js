import React from 'react';
import StudentTable from '../pages/students';
import Overview from '../pages/overview';
import StudentDetails from '../pages/studentDetails';
import Courses from '../pages/courses';
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
import CourseDetails from '../pages/courseDetails';
import Message from '../pages/message';
import AddCourse from '../pages/addCourse';
import EditCourse from '../pages/editCourse';

const routesList = [
  {
    path: 'overview',
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
        path: 'students',
        label: 'Student List',
        icon: <TeamOutlined />,
        element: <StudentTable />,
      },
      {
        path: 'students/:id',
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
        path: 'teachers',
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
        path: 'courses',
        label: 'All Courses',
        icon: <ProjectOutlined />,
        element: <Courses />,
      },
      {
        path: 'courses/:id',
        label: 'Detail',
        element: <CourseDetails />,
      },
      {
        path: 'courses/add-course',
        label: 'Add Course',
        element: <AddCourse />,
        icon: <FileAddOutlined />,
      },
      {
        path: 'courses/edit-course',
        label: 'Edit Course',
        icon: <EditOutlined />,
        element: <EditCourse />,
      },
    ],
  },
  {
    label: 'Message',
    path: 'message',
    icon: <MessageOutlined />,
    element: <Message />
  },
];

export default routesList;
