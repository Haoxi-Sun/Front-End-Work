import axios from "axios";
import { message } from "antd";

const baseURL = "http://cms.chtoma.com/api";
const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.defaults.timeout = 100000;

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes("login")) {
    const token = JSON.parse(localStorage.getItem("Data")).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function post(path, params) {
  const url = baseURL + path;
  return axiosInstance
    .post(url, params)
    .then((res) => res.data)
    .catch((error) => {
      message.error(error.response.data.msg);
      return error;
    });
}

function put(path, params) {
  const url = baseURL + path;
  return axiosInstance
    .put(url, params)
    .then((res) => res.data)
    .catch((error) => {
      message.error(error.response.data.msg);
      return error;
    });
}

function del(path) {
  const url = baseURL + path;
  return axiosInstance
    .delete(url)
    .then((res) => res.data)
    .catch((error) => {
      message.error(error.response.data.msg);
      return error;
    });
}

function get(path) {
  const url = baseURL + path;
  return axiosInstance
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      message.error(error.response.data.msg);
      return error;
    });
}

export { post, put, del, get };
