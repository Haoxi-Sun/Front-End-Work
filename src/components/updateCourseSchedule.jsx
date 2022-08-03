import { Form, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import {} from 'react-router-dom';
import { getCourseSchedule } from '../api/api';

export default function UpdateCourseSchedule({ course }) {
  const [form] = Form.useForm();
  const [courseSchedule, setCourseSchedule] = useState([]);

  useEffect(() => {
    if (!!course) {
      const courseId = course[0].id;
      const scheduleId = course[0].scheduleId;

      getCourseSchedule({ courseId, scheduleId }).then((res) => {
        if (res) {
          setCourseSchedule(res);
        }
      });
    }
  }, []);
  console.log(courseSchedule);
  return (
    <>
      <Form
        form={form}
        name="schedule"
        layout="horizontal"
      >
        <Row gutter={[6, 16]}>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.List name="chapters">
           
            {(fields, {add, remove}) => (
                   <>
                   
                   </>
                )}
          
                
            </Form.List>
          </Col>
          <Col span={12}>
            <h2>Class Times</h2>
          </Col>
        </Row>
      </Form>
    </>
  );
}
