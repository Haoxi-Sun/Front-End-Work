import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import { Button, Input, Space, Table, Popconfirm, Modal, Form } from 'antd';
import TeacherForm from '../../components/manager/teacherForm';
import styled from 'styled-components';
import { getTeachers } from '../../api/api';
import _debounce from 'lodash.debounce';

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

export default function Teachers() {
  const [form] = Form.useForm();
  const [isAdd, setIsAdd] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editValues, setEditValues] = useState({});
  const debounceValue = useCallback(
    _debounce(handleDebounceFunction, 1000),
    []
  );

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
          <a
            onClick={() => {
              setIsAdd(false);
              setEditValues(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  function handleDebounceFunction(query, pagination) {
    console.log(pagination, query);
    getTeachers({
      query,
      ...pagination,
    }).then((res) => {
      if (res) {
        setData(res.teachers);
      }
    });
  }

  return (
    <>
      <AddSearch>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setIsAdd(true);
            setEditValues({});
          }}
        >
          + Add
        </Button>
        <Search
          placeholder="Search by Name"
          onChange={(event) => {
            if (event.target.value !== '') {
              debounceValue(event.target.value, pagination);
            }
          }}
        />
      </AddSearch>
      <Modal
        centered
        destroyOnClose
        visible={isModalVisible}
        title={isAdd ? 'Add Teacher' : 'Edit Teacher'}
        onCancel={() => setIsModalVisible(false)}
        okText={isAdd ? 'Add' : 'Update'}
        onOk={form.submit}
      >
        <TeacherForm isAdd={isAdd} editValues={editValues} form={form}/>
      </Modal>
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
