import React, { useCallback, useState } from 'react';
import 'antd/dist/antd.min.css';
import styled from 'styled-components';
import { Input, Select, Row, Col, Spin, Tabs } from 'antd';
import AddCourseForm from '../components/addCourseForm';
import { getCourses } from '../api/api';
import _debounce from 'lodash.debounce';
import UpdateCourseSchedule from '../components/updateCourseSchedule';
const { Option } = Select;
const { TabPane } = Tabs;
export default function EditCourse() {
  const [searchType, setSearchType] = useState('uid');
  const [isCourseSearch, setIsCourseSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [course, setCourse] = useState();

  const debouncedQuery = useCallback(_debounce(handleDebounceFunction, 500), [
    searchType,
  ]);

  function handleDebounceFunction(debounceValue){
    setIsCourseSearching(true);
    getCourses({
      [searchType]: debounceValue,
      userId: localStorage.getItem('userId'),
    })
      .then((res) => {
        if (res) {
          setSearchResults(res.courses);
        } else {
          message.error('Course Not Found');
        }
      })
      .finally(() => {
        setIsCourseSearching(false);
      });
  };

  return (  
    <>
      <Row gutter={[6, 16]} style={{ marginBottom: '16px' }}>
        <Col span={12} style={{ marginLeft: '1.6%' }}>
          <Input.Group compact size="large" style={{ display: 'flex' }}>
            <Select
              defaultValue="uid"
              onChange={(value) => setSearchType(value)}
            >
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              style={{ flex: 1 }}
              allowClear
              notFoundContent={isCourseSearch ? <Spin size="small" /> : null}
              placeholder={`Search course by ${searchType}`}
              filterOption={false}
              showSearch
              onSearch={(value) => {
                if (!value) {
                  return;
                } else {
                  debouncedQuery(value);
                }
              }}
              onSelect={(id) =>{
                const course = searchResults.filter((result) => result.id === id)
                setCourse(course);
              }}
            >
              {searchResults.map((result) => (
                <Option key={result.id} value={result.id}>
                  {result.name} - {result.teacherName} - {result.uid}
                </Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        type="card"
        size="large"
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} style={{ marginLeft: '1.6%' }} />
        )}
        animated
      >
        <TabPane tab="Course Detail" key="course" style={{paddingLeft: "24px"}}>
          <AddCourseForm course={course} isAdd={false}/>
        </TabPane>
        <TabPane tab="Course Schedule" key="courseSchedule" style={{paddingLeft: "24px"}}>
            <UpdateCourseSchedule course={course} />
        </TabPane>
      </Tabs>
    </>
  );
}
