import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import { Button, Input, Space, Table, Popconfirm, Modal } from 'antd';
import TeacherForm from '../../components/manager/teacherForm';
import styled from 'styled-components';
import { getTeachers } from '../../api/api';

const Search = styled(Input.Search)`
  width: 30%;
  display: block;
`;
const AddSearch = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: center;
  margin-bottom: 16px;
`;
const columns = [
  {
    title: 'No.',
    key: 'index',
    render: (_1, _2, index) => index + 1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (prevStudent, nextStudent) =>
      prevStudent.name.localeCompare(nextStudent.name),
    render: (_, record) => <a>{record.name}</a>,
  },
  {
    title: 'Country',
    dataIndex: 'country',
    filters: [
      {
        text: 'China',
        value: 'China',
      },
      {
        text: 'New Zealand',
        value: 'New Zealand',
      },
      {
        text: 'Canada',
        value: 'Canada',
      },
      {
        text: 'Australia',
        value: 'Australia',
      },
    ],
    onFilter: (value, record) => record.country.includes(value),
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Skill',
    dataIndex: 'skills',
    render: (skills) => skills.map((skill) => skill.name).join(','),
  },
  {
    title: 'Course Amount',
    dataIndex: 'courseAmount',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
export default function Teachers() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTeachers(pagination)
      .then((res) => {
        if (res) {
          setData(res.teachers);
          setTotal(res.total);
        }
      })
      .finally(() => setIsLoading(false));
  }, [pagination]);

  return (
    <>
      <AddSearch>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          + Add
        </Button>
        <Search placeholder="Search by Name" />
      </AddSearch>
      <TeacherForm isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
      <Table
        rowKey={'id'}
        columns={columns}
        loading={isLoading}
        pagination={{
          total: total,
          pageSize: pagination.limit,
          current: pagination.page,
        }}
        onChange={(page) =>
          setPagination({ limit: page.pageSize, page: page.current })
        }
        dataSource={data}
      />
    </>
  );
}
