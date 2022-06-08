import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import {
  Button,
  Input,
  message,
  Space,
  Table,
  Modal,
  Form,
  Select,
  Popconfirm,
} from "antd";
import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";
import axios from "axios";

const { Option } = Select;

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
  const [form] = Form.useForm();

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
      render: (_, record) => (
        <Space>
          <a href="/#">Edit</a>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              const token = JSON.parse(localStorage.getItem("Data")).token;
              axios
                .delete(`http://cms.chtoma.com/api/students/${record.id}`, {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                })
                .then((response) => {
                  if (response.data.data) {
                    const newData = data.filter(
                      (item) => item.id !== record.id
                    );
                    setData(newData);
                    setTotal(total - 1);
                  }
                })
                .catch((error) => {
                  message.error("Cannot delete this row!");
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

  const handleAdd = (event) => {
    event.preventDefault();
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        // axios
        //   .post(
        //     "http://cms.chtoma.com/api/students",
        //     values,
        //     {
        //       headers: {
        //         Authorization: "Bearer " + token,
        //       },
        //     }
        //   )
        //   .then((response) => {
        //     console.log(response);
        //   });
      })
      .catch((error) => {
        message.error(error);
      });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("Data")).token;
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
      .then((res) => {
        setData(res.data.data.students);
        setLoading(false);
        setTotal(res.data.data.total);
      })
      .catch((error) => {
        message.error("Cannot get students information!");
      });
  }, [pagination]);


  const [filterInput, setFilterInput] = React.useState("");
  const filterData = () => {
    if (filterInput === "") return data;

    if (isNaN(filterInput)) {
      return data.filter(({ name }) => name.toLowerCase().includes(filterInput.toLowerCase()));
    }
  };

  return (
    <>
      <AddSearch>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          + Add
        </Button>
        <Search
          placeholder="Search by name"
          onSearch={setFilterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          style={{
            width: "30%",
            display: "block",
          }}
        />
      </AddSearch>

      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={filterData()}
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
      <Modal
        title="Add Student"
        afterClose={() => form.resetFields()}
        centered
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            offset: 1,
          }}
          layout="horizontal"
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Area" name="area" rules={[{ required: true }]}>
            <Select>
              <Option value="China">China</Option>
              <Option value="New Zealand">New Zealand</Option>
              <Option value="Canada">Canada</Option>
              <Option value="Australia">Australia</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Student Type"
            name="type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="1">Tester</Option>
              <Option value="2">Developer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
