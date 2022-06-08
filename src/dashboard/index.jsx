import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Manager from "./manager/index";

export default function Dashboard() {
  return (
    <>
      <Routes>
        <Route path="/manager/*" element={<Manager />} />
        <Route path="*" element={<Navigate to="/manager/" />} /> 
      </Routes>
    </>
  );
}
