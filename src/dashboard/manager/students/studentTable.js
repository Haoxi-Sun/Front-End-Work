import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import { Button, Input, message, Space, Table } from "antd";
import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";
import axios from "axios";

const { Search } = Input;

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
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (prevStudent, nextStudent) =>
        prevStudent.name.localeCompare(nextStudent.name),
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
      render: () => (
        <Space>
          <a href="/#">Edit</a>
          <a href="/#">Delete</a>
        </Space>
      ),
    },
  ];

  const fetchData = (params = {}) => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("Data")).token;
    axios
      .get(
        `http://cms.chtoma.com/api/students?page=${params.pagination.current}&limit=${params.pagination.pageSize}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        setData(res.data.data.students);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: res.data.data.total,
        });
      })
      .catch((error) => {
        message.error("Cannot get students information!");
      });
  };

  useEffect(() => {
    fetchData({ pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (newPagination) => {
    fetchData({
      pagination: newPagination,
    });
  };

  return (
    <>
      <AddSearch>
        <Button type="primary">+ Add</Button>
        <Search
          placeholder="Search by name"
          style={{
            width: "30%",
            display: "block",
          }}
        />
      </AddSearch>
      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}
