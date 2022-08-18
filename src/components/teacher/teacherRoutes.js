import React from 'react';
import {
  MessageOutlined,
  ReadOutlined,
  CalendarOutlined,
  SolutionOutlined,
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  EditOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import ClassSchedule from '../../pages/teacher/classSchedule';

const teacherRoutes = [
  {
    label: 'Overview',
    path: 'teacher/overview',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Class Schedule',
    element: <ClassSchedule />,
    icon: <CalendarOutlined />,
    path: 'teacher/schedule',

  },
  {
    label: 'Student',
    icon: <SolutionOutlined />,
    children: [
      {
        label: 'Student List',
        path: 'teacher/students',
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
        label: 'All Courses',
        icon: <ProjectOutlined />,
        path: 'teacher/courses',

      },
      {
        label: 'Detail',
        path: 'teacher/courses/:id',

      },
      {
        label: 'Add Course',
        path: 'teacher/courses/add-course',
        icon: <FileAddOutlined />,
      },
      {
        label: 'Edit Course',
        icon: <EditOutlined />,
        path: 'teacher/courses/edit-course',
      },
    ],
  },
  {
    label: 'Message',
    icon: <MessageOutlined />,
    path: 'teacher/message',

  },
];

export default teacherRoutes;
