import { post, put, del, get } from "./api-service";
import { AES } from "crypto-js";

function loginApi(values) {
  const { password } = values;
  const pwd = AES.encrypt(values.password, "cms").toString();

  return post("/login", {
    ...values,
    password: pwd,
  }).then((res) => {
    localStorage.setItem("Data", JSON.stringify(res.data));
    return res.data;
  });
}

function addStudentApi(values) {
  return post("/students", values).then((res) => {
    return res.data;
  });
}

function editStudentApi(values) {
  return put("/students", values).then((res) => {
    return res.data;
  });
}

function deleteStudentApi(value) {
  return del(`/students/${value}`).then((res) => {
    return res.data;
  });
}

function searchStudentApi(debounceValue, current, pageSize) {
  return get(
    `/students?query=${debounceValue}&page=${current}&limit=${pageSize}`
  ).then((res) => {
    return res.data;
  });
}

function showStudentsApi(params) {
  return get("/students", params).then((res) => {
    return res.data;
  });
}

export {
  loginApi,
  addStudentApi,
  editStudentApi,
  deleteStudentApi,
  searchStudentApi,
  showStudentsApi,
};
