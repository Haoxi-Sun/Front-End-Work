import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import styled from 'styled-components';
import { Form, Steps, Row, Col, Input, Upload } from 'antd';
import AddCourseForm from '../components/addCourseForm';

const { Step } = Steps;

const stepStyle = {
  padding: '1em 1.6%',
  margin: '20px 0px',
};

export default function AddCourse() {

  return (
    <>
      <Steps type="navigation" current={0} style={stepStyle}>
        <Step title="Course Detail" status="process" />
        <Step title="Course Schedule" status="wait" />
        <Step title="Success" status="wait" />
      </Steps>
      <div style={{ display: 'block' , marginLeft: '24px'}}>
       <AddCourseForm isAdd={true} />
      </div>
    </>
  );
}
