import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import { Button, Input, Table } from "antd";
import styled from "styled-components";
import axios from "axios";
const { Search } = Input;

const AddSearch = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: center;
  margin-bottom: 16px;
`;

const columns = [
  {
    title: "No.",
    dataIndex: "number",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "15%",
  },
  {
    title: "Area",
    dataIndex: "area",
    width: "15%",
    filters: [
      {
        text: "China",
        value: "china",
      },
      {
        text: "New Zealand",
        value: "nz",
      },
      {
        text: "Canada",
        value: "canada",
      },
      {
        text: "Australia",
        value: "aus",
      },
    ],
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "15%",
  },
  {
    title: "Selected Curriculum",
    dataIndex: "selected_curriculum",
    width: "20%",
  },
  {
    title: "Student Type",
    dataIndex: "student_type",
    width: "15%",
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
  },
  {
    title: "Join Time",
    dataIndex: "join_time",
    width: "15%",
  },
  {
    title: "Action",
    width: "20%",
    dataIndex: "",
    render: () => <a>Edit</a>,
    render: () => <a>Delete</a>,
  },
];

export default function StudentTable() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = (params = {}) => {
    setLoading(true);
    axios
      .get(
        `http://cms.chtoma.com/api/students?page=${pagination.current}&limit=${pagination.pageSize}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => console.log(response));
  };
  useEffect(() => {
    fetchData({ pagination });
  }, []);
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
      <Table columns={columns} />
    </>
  );
}
