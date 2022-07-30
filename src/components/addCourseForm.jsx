import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import styled from 'styled-components';
import {
  Form,
  Row,
  Col,
  Input,
  Upload,
  Select,
  message,
  Spin,
  DatePicker,
  InputNumber,
  Button,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { getCoursesType, getTeachers } from '../api/api';
import moment from 'moment';

const { Option } = Select;

const DescriptionTextArea = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 30px;
    bottom: 24px;
    left: 24px;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  text-area {
    height: 100%;
  }
`;

const UploadItem = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 30px;
    bottom: 24px;
    left: 24px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control-input div {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-content {
      width: 50%;
      .ant-tooltip-arrow {
        height: 13px;
      }
      .ant-tooltip-inner {
        text-align: center;
      }
    }
  }
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #e3e3e3;
  width: 100%;
  .anticon svg {
    font-size: 50px;
    color: #5db0d2;
  }
  p {
    font-weight: bold;
    font-size: 20px;
    color: #808080;
  }
`;

export default function AddCourseForm() {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [isTeacherSearching, setIsTeacherSearching] = useState(false);
  const [courses, setCourses] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getCoursesType().then((res) => {
      if (res) {
        setCourses(res.courses);
      }
    });
  }, []);

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }
  };

  const filterCoursesType = (data) => {
    let obj = {};
    const coursesType = data.map((course) => course.type).flat();
    const uniqueTypes = coursesType.reduce((pre, cur) => {
      if (!obj[cur.name.toLowerCase()]) {
        obj[cur.name.toLowerCase()] = [cur.name];
        pre.push(cur);
      }
      return pre;
    }, []);
    return uniqueTypes;
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Row style={{ marginBottom: '8px' }}>
          <Col span={8} style={{ paddingLeft: '24px' }}>
            <Form.Item
              name="courseName"
              label="Course Name"
              rules={[
                {
                  required: true,
                },
                {
                  min: 3,
                  max: 100,
                  message: "'name' must be between 3 and 100 characters",
                },
              ]}
            >
              <Input placeholder="Course name" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={8} style={{ paddingLeft: '24px' }}>
                <Form.Item
                  name="teacher"
                  label="Teacher"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select teacher"
                    defaultActiveFirstOption={false}
                    notFoundContent={
                      isTeacherSearching ? <Spin size="small" /> : null
                    }
                    filterOption={false}
                    onSearch={(query) => {
                      setIsTeacherSearching(true);
                      getTeachers({ query: query }).then((res) => {
                        if (res) {
                          setTeachers(res.teachers);
                        } else {
                          message.error('Teacher Not Found');
                        }
                        setIsTeacherSearching(false);
                      });
                    }}
                  >
                    {teachers.map((teacher) => (
                      <Option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{ paddingLeft: '24px' }}
                >
                  <Select
                    mode="multiple"
                    defaultActiveFirstOption={false}
                    placeholder="Type"
                  >
                    {filterCoursesType(courses).map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* get uid from courses uid? */}
              <Col span={8} style={{ paddingLeft: '24px' }}>
                <Form.Item
                  name="courseCode"
                  label="Course Code"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled placeholder="Course Code" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ marginTop: '40px' }}>
          <Col span={8} style={{ paddingLeft: '24px' }}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select date"
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  return current && current < moment().endOf('day');
                }}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input prefix="$" />
            </Form.Item>
            <Form.Item
              name="studentLimit"
              label="Student Limit"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter={
                  <Select defaultValue="months">
                    <Option value="years">Year(s)</Option>
                    <Option value="months">Month(s)</Option>
                    <Option value="days">Day(s)</Option>
                    <Option value="weeks">Week(s)</Option>
                    <Option value="hours">Hour(s)</Option>
                  </Select>
                }
                min={1}
              />
            </Form.Item>
          </Col>
          <Col span={8} style={{ paddingLeft: '24px', position: 'relative' }}>
            <DescriptionTextArea
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea style={{ height: '100%' }} />
            </DescriptionTextArea>
          </Col>
          <Col span={8} style={{ paddingLeft: '24px', position: 'relative' }}>
            <UploadItem name="cover" label="Cover">
              <ImgCrop>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList: file }) => {
                    setFileList(file);
                  }}
                  onPreview={onPreview}
                >
                  {fileList.length >= 1 ? null : (
                    <UploadInner>
                      <InboxOutlined />
                      <p>Click or drag file to this area to upload</p>
                    </UploadInner>
                  )}
                </Upload>
              </ImgCrop>
            </UploadItem>
          </Col>
        </Row>
        <Row>
            <Col style={{ paddingLeft: '24px' }}>
                <Form.Item name="submitButton">
                    <Button type='primary' htmlType='submit'>Create Course</Button>
                </Form.Item>
            </Col>
        </Row>
      </Form>
    </>
  );
}
