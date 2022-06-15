import React from "react";
import axios from "axios";

const baseURL = "http://cms.chtoma.com/api";
const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    //   config.data = JSON.stringify(config.data);
    if (!config.url.includes("login")) {
      const token = JSON.parse(localStorage.getItem("Data")).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function post(url, data) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default post;
