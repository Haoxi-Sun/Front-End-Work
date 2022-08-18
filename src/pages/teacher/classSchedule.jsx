import { Calendar, Card , Row, Col} from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  getDay,
  isSameDay,
  getMonth,
  getYear,
} from 'date-fns';
import { cloneDeep, orderBy, omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getClassSchedule } from '../../api/api';

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const courseTypeColors = [
    'magenta',
    'volcano',
    'orange',
    'gold',
    'green',
    'cyan',
    'crimson',
    'purple',
    'red',
    'lime',
  ];
  
function sortWeekdaysBy(weekDays, start) {
  const startWeekDay = getDay(start);
  weekDays = orderBy(weekDays, ['weekday', 'time'], ['asc', 'asc']);
  const firstIndex = weekDays.findIndex((item) => item.weekday === startWeekDay);
  
  const head = weekDays.slice(firstIndex);
  const rest = weekDays.slice(0, firstIndex);
  return [...head, ...rest];
}

function generateClassCalendar(course) {
  const { startTime, durationUnit, duration, schedule } = course;

  if (!schedule.classTime) {
    return [];
  }

  const chaptersCopy = cloneDeep(schedule.chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks, addHours];
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start); 
  
  const transformWeekday = (day) => weekDays.findIndex((item) => item === day);
  const classTime = schedule.classTime.map((item) => {
    const [day, time] = item.split(' ');
    const weekday = transformWeekday(day);
    return { weekday, time };
  });

  const sortClassTime = sortWeekdaysBy(classTime, start);
  const getClassInfo = (day) => sortClassTime.find((item) => item.weekday === day);
  const result = [
    {
      date: start,
      chapter: chaptersCopy.shift(),
      weekday: getDay(start),
      time: '',
    },
  ];

  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassInfo(day);

    if (classInfo) {
      const chapter = chaptersCopy.shift();
      result.push({ date, chapter, ...classInfo });
    }
  }

  return result;
}

export default function ClassSchedule() {
  const [data, setData] = useState([]);
  const [notifyInfo, setNotifyInfo] = useState();

  useEffect(() => {
    getClassSchedule().then((res) => {
      if (res) {
        const result = res.map((course) => ({
          ...course,
          calendar: generateClassCalendar(course),
        }));
        setData(result);
      }
    });
  }, []);
  
  const dateCellRender = (current) => {
    
    const listData = data
      .map((course) => {
        const { calendar } = course;
        const target = calendar.find((item) => isSameDay(new Date(current), item.date));
        return !!target ? { class: target, ...omit(course, 'calendar') } : null;
      })
      .filter((item) => !!item);
    return (
      <>
        {listData.map((item, index) => (
          <Row
            gutter={[6, 6]}
            key={index}
            style={{ fontSize: 12 }}
            onClick={() => setNotifyInfo(item)}
          >
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>

            <Col span={8} offset={1}>
              {item.class.time}
            </Col>

            <Col
              offset={1}
              style={{ color: courseTypeColors[item.type[0]?.id % 9] }}
            >
              {item.name}
            </Col>
          </Row>
        ))}
      </>
    );
  };

  const monthCellRender = (current) => {
    const month = getMonth(current);
    const year = getYear(current);
    const result = data
      .map((course) => {
        const result = course.calendar.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);

          return classYear === year && classMonth === month;
        });
        const total = result.length;

        return !!total ? { ...course, statistics: { total } } : null;
      })
      .filter((item) => !!item);

    return result.length ? (
      <>
        {result.map((course) => (
          <Row gutter={[6, 6]} key={course.id}>
            <Col>
              <b>{course.name}</b>
            </Col>
            <Col offset={1}>{course.statistics.total} lessons</Col>
          </Row>
        ))}
      </>
    ) : null;
  };

  return (
    <>
      <Card bordered title="My Class Schedule">
        <Calendar dateCellRender={dateCellRender}  monthCellRender={monthCellRender}/>
      </Card>
    </>
  );
}
