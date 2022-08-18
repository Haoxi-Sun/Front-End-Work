import { Form, Row, Col, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import {} from 'react-router-dom';
import { getCourseSchedule } from '../../api/api';

const chapters = 'chapters';
const classTime = 'classTime';

export default function UpdateCourseSchedule({ course, isAdd }) {
  const [form] = Form.useForm();
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);

  useEffect(() => {
    if (!!course) {
      const courseId = course[0].id;
      const scheduleId = course[0].scheduleId;

      getCourseSchedule({ courseId, scheduleId }).then((res) => {
        if (res) {
          const classTimes = res.classTime.map((item) => {
            const [weekday, time] = item.split(' ');
            return { weekday, time: new Date(`2022-08-09 ${time}`) };
          });
          form.setFieldsValue({
            chapters: res.chapters,
            classTime: classTimes,
          });
          setSelectedWeekdays(classTimes.map((item) => item.weekday));
        }
      });
    }
  }, [course]);

  const initialValues = {
    [chapters]: [{ name: '', content: '' }],
    [classTime]: [{ weekday: '', time: '' }],
  };

  return (
    <>
      <Form
        form={form}
        name="schedule"
        layout="horizontal"
        initialValues={initialValues}
      >
        <Row gutter={[6, 16]}>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.List name={chapters}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={20}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Chapter Name" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'content']}
                          fieldKey={[field.fieldKey, 'content']}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Chapter content" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <Form.Item>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                remove(field.name);
                              } else {
                                message.warn(
                                  'You must set at least one chapter.'
                                );
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          size="large"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Chapter
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>

          <Col span={12}>
            <h2>Class Times</h2>
            <Form.List name={classTime}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={20}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'weekday']}
                          fieldKey={[field.fieldKey, 'weekday']}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'time']}
                          fieldKey={[field.name, 'time']}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Select Time" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <Form.Item>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                remove(field.name);
                              } else {
                                message.warn(
                                  'You must set at least one chapter.'
                                );
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          size="large"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Class Time
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </>
  );
}
