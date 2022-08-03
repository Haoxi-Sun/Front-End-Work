import React, { useEffect, useState, useCallback } from 'react';
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
  Modal,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import {
  getCourseTypes,
  getTeachers,
  getCourseCode,
  addCourses,
  updateCourses,
} from '../api/api';
import moment from 'moment';
import _debounce from 'lodash.debounce';

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

export default function AddCourseForm({ isAdd, course }) {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState();
  const [isTeacherSearching, setIsTeacherSearching] = useState(false);
  const [courseTypes, setCourseTypes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState();
  const [durationUnit, setDurationUnit] = useState(1);
  const [isAddCourse, setIsAddCourse] = useState(isAdd);
  const debouncedQuery = useCallback(
    _debounce(handleDebounceFunction, 500),
    []
  );

  useEffect(() => {
    getCourseTypes().then((res) => {
      if (res) {
        setCourseTypes(res);
      }
    });

    if (isAddCourse) {
      getCourseCode().then((res) => {
        if (res) {
          const uid = res;
          form.setFieldsValue({ uid });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!!course) {
      const courseInfo = course[0];
      const courseDetail = {
        ...courseInfo,
        type: courseInfo.type.map((item) => item.id),
        startTime: moment(courseInfo.startTime),
        teacherId: courseInfo.teacherName,
      };

      setDurationUnit(courseInfo.durationUnit);
      form.setFieldsValue(courseDetail);
      setFileList([{ name: 'Cover Image', url: courseInfo.cover }]);
    }
  }, [course, durationUnit]);

  function handleDebounceFunction(debounceValue) {
    getTeachers({ query: debounceValue }).then((res) => {
      if (res) {
        setTeachers(res.teachers);
      } else {
        message.error('Teacher Not Found');
      }
    });
  }

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    setPreview({
      previewImage: file.url || file.preview,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleFinish = (event) => {
    if (!isAdd && !course) {
      message.error('You must select a course to update!');
      return;
    }

    const courseRequest = {
      ...event,
      durationUnit: durationUnit,
      teacherId: event.teacherId || course[0].teacherId,
      startTime: moment(event.startTime).format('YYYY-MM-DD HH:mm:ss'),
      cover: event.cover  === undefined ? "" : event.cover,
    };

    if (isAdd) {
      addCourses(courseRequest).then((res) => {
        if (!!res && !course) {
            setIsAddCourse(false);
        }
      });
    }else{
        updateCourses({...courseRequest, id: course[0].id}).then(res => {
            if (!!res && !course) {
                setIsAddCourse(false);
            }
        })
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        labelCol={{ offset: 1 }}
        labelWrap={{ offset: 1 }}
      >
        <Row gutter={[6, 16]}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Course Name"
              rules={[
                {
                  required: true,
                },
                {
                  min: 3,
                  max: 100,
                },
              ]}
            >
              <Input placeholder="Course name" />
            </Form.Item>
          </Col>

          <Col span={16}>
            <Row gutter={[6, 16]}>
              <Col span={8}>
                <Form.Item
                  name="teacherId"
                  label="Teacher"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{ marginLeft: 5 }}
                >
                  <Select
                    showSearch
                    placeholder="Select teacher"
                    value={course ? course[0].teacherId : teacherId}
                    notFoundContent={
                      isTeacherSearching ? <Spin size="small" /> : null
                    }
                    filterOption={false}
                    allowClear
                    onSearch={(query) => {
                      if (!query) {
                        return;
                      } else {
                        setIsTeacherSearching(true);
                        debouncedQuery(query);
                        setIsTeacherSearching(false);
                      }
                    }}
                    onSelect={(value) => setTeacherId(value)}
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
                >
                  <Select
                    mode="multiple"
                    defaultActiveFirstOption={false}
                    placeholder="Type"
                  >
                    {courseTypes.map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="uid"
                  label="Course Code"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled placeholder="Course Code" type="text" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={[6, 16]}>
          <Col span={8}>
            <Form.Item
              name="startTime"
              label="Start Date"
              rules={[
                {
                  required: true,
                },
                {
                  type: 'object',
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select date"
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  return current && current <= moment().startOf('day');
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
              <InputNumber prefix="$" style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
              name="maxStudents"
              label="Student Limit"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
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
                  <Select
                    name="durationUnit"
                    value={durationUnit}
                    onChange={(value) => setDurationUnit(value)}
                  >
                    <Option value={1}>Year(s)</Option>
                    <Option value={2}>Month(s)</Option>
                    <Option value={3}>Day(s)</Option>
                    <Option value={4}>Week(s)</Option>
                    <Option value={5}>Hour(s)</Option>
                  </Select>
                }
                min={1}
              />
            </Form.Item>
          </Col>
          <Col span={8} style={{ position: 'relative' }}>
            <DescriptionTextArea
              name="detail"
              label="Description"
              rules={[
                {
                  required: true,
                },
                {
                  min: 100,
                  max: 1000,
                  message:
                    'Description length must between 100 - 1000 characters.',
                },
              ]}
            >
              <Input.TextArea style={{ height: '100%' }} />
            </DescriptionTextArea>
          </Col>
          <Col span={8} style={{ position: 'relative' }}>
            <UploadItem name="cover" label="Cover">
              <ImgCrop rotate={true}>
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
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isAddCourse ? 'Create Course' : 'Update Course'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        visible={!!preview}
        title={preview?.previewTitle}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img
          alt="example"
          style={{ width: '100%' }}
          src={preview?.previewImage}
        />
      </Modal>
    </>
  );
}
