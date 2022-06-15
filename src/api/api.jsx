import React from "react";
import POST from "./api-server";
import { AES } from "crypto-js";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function login(values) {
  const navigate = useNavigate();
  POST("/login", {
    ...values,
    password: AES.encrypt(values.password, "cms").toString(),
  })
    .then((res) => {
      localStorage.setItem("Data", JSON.stringify(res.data));
      navigate(`/dashboard/${res.data.role}`, { state: res.data });
    })
    .catch((error) => {
      message.error(error.message);
    });
}
