import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Button, Input, Space, Table, Popconfirm } from "antd";
import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";
import StudentForm from "../components/studentForm";
import _debounce from "lodash.debounce";
import { deleteStudent, showStudents } from "../api/api";

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

export default function StudentTable() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    // current: number pageSize: number;
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editValues, setEditValues] = useState();

  const [query, setQuery] = useState("");
  const debouncedQuery = useCallback(
    _debounce(handleDebounceFunction, 500),
    []
  );

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (prevStudent, nextStudent) => {
        prevStudent.name.localeCompare(nextStudent.name);
      },
      render: (_, record) => <Link to={`${record.id}`}>{record.name}</Link>,
    },
    {
      title: "Area",
      dataIndex: "country",
      width: "10%",
      filters: [
        {
          text: "China",
          value: "China",
        },
        {
          text: "New Zealand",
          value: "New Zealand",
        },
        {
          text: "Canada",
          value: "Canada",
        },
        {
          text: "Australia",
          value: "Australia",
        },
      ],
      onFilter: (value, record) => record.country.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      width: "25%",
      render: (courses) => courses.map((item) => item.name).join(","),
    },
    {
      title: "Student Type",
      dataIndex: "type",
      filters: [
        {
          text: "Developer",
          value: "developer",
        },
        {
          text: "Tester",
          value: "tester",
        },
      ],
      render: (type) => type?.name,
      onFilter: (value, record) => record.type.name.includes(value),
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (value) =>
        formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setEditValues(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              deleteStudent(record.id).then((res) => {
                if (res) {
                  const newData = data.filter((item) => item.id !== record.id);
                  setData(newData);
                  setTotal(total - 1);
                }
              });
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    showStudents({
      page: pagination.current,
      limit: pagination.pageSize,
    }).then((res) => {
      if (res) {
        setData(res.students);
        setTotal(res.total);
        setLoading(false);
      }
    });
  }, [pagination]);

  function handleDebounceFunction(debounceValue) {
    showStudents({
      query: debounceValue,
      page: pagination.current,
      limit: pagination.pageSize,
    }).then((res) => setData(res.students));
  }

  const handleChange = (event) => {
    setQuery(event.target.value);
    debouncedQuery(event.target.value);
  };

  return (
    <>
      <AddSearch>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setEditValues(undefined);
          }}
        >
          + Add
        </Button>
        <Search placeholder="Search by name" onChange={handleChange} />
      </AddSearch>
      <StudentForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        value={editValues}
      />
      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data}
        pagination={{
          total: total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        }}
        loading={loading}
        onChange={({ current, pageSize }) => {
          setPagination({ current, pageSize });
        }}
      />
    </>
  );
}
