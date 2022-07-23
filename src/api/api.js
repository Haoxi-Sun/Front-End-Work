import { post, put, del, get } from './api-service';
import { AES } from 'crypto-js';
import axios from 'axios';

function login(values) {
  const { password } = values;
  const pwd = AES.encrypt(values.password, 'cms').toString();

  return post('/login', {
    ...values,
    password: pwd,
  }).then((res) => {
    localStorage.setItem('Data', JSON.stringify(res.data));
    return res.data;
  });
}

function logout() {
  return post('/logout', {}).then((res) => {
    localStorage.clear('Data');
    return res.data;
  });
}

function addStudent(values) {
  return post('/students', values).then((res) => {
    return res.data;
  });
}

function editStudent(values) {
  return put('/students', values).then((res) => {
    return res.data;
  });
}

function deleteStudent(value) {
  return del(`/students/${value}`).then((res) => {
    return res.data;
  });
}

function getStudents(params) {
  return get('/students', params).then((res) => {
    return res.data;
  });
}

function getStudentDetails(value) {
  return get(`/students/${value}`, {}).then((res) => {
    return res.data;
  });
}

function getOverview() {
  return get('/statistics/overview').then((res) => {
    return res.data;
  });
}

function getStatistics(type) {
  return get(`/statistics/${type}`, {}).then((res) => {
    return res.data;
  });
}

async function getWorld() {
  return await axios.get(
    'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
  );
}

function getCourses(params) {
  return get('/courses', params).then((res) => {
    return res.data;
  });
}

function getCourseDetails(params) {
  return get('/courses/detail', params).then((res) => {
    return res.data;
  });
}

function getMessages(params) {
  return get('/message', params).then((res) => {
    return res.data;
  });
}

function getMessageStatistics() {
  return get('/message/statistics', {}).then((res) => {
    return res.data;
  });
}

function markAsRead(params){
  return put('/message', {...params, ...{status : 1}}).then(res =>{
    return res.data;
  })
}

function messageEvent(){
  const userId = localStorage.getItem('userId');
  return new EventSource(`http://cms.chtoma.com/api/message/subscribe?userId=${userId}`, { withCredentials: true });
}
export {
  login,
  logout,
  addStudent,
  editStudent,
  deleteStudent,
  getStudents,
  getStudentDetails,
  getOverview,
  getStatistics,
  getWorld,
  getCourses,
  getCourseDetails,
  getMessages,
  getMessageStatistics,
  markAsRead,
  messageEvent
};
