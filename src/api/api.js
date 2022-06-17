import { post, put, del, get } from "./api-service";
import { AES } from "crypto-js";

function LoginAPI(values) {
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

function Add_StudentAPI(values) {
  return post("/students", values).then((res) => {
    return res.data;
  });
}

function Edit_StudentAPI(values) {
  return put("/students", values).then((res) => {
    return res.data;
  });
}

function Delete_StudentAPI(value) {
  return del(`/students/${value}`).then((res) => {
    return res.data;
  });
}

function Search_StudentAPI(debounceValue, current, pageSize) {
  return get(
    `/students?query=${debounceValue}&page=${current}&limit=${pageSize}`
  ).then((res) => {
    return res.data;
  });
}

function Show_StudentsAPI(current, pageSize) {
  return get(`/students?page=${current}&limit=${pageSize}`).then((res) => {
    return res.data;
  });
}

export {
  LoginAPI,
  Add_StudentAPI,
  Edit_StudentAPI,
  Delete_StudentAPI,
  Search_StudentAPI,
  Show_StudentsAPI,
};
