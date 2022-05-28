import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import Manager from "./dashboard/manager";
import Student from "./dashboard/student";
import Teacher from "./dashboard/teacher";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="dashboard/manager" element={<Manager />} />
          <Route path="dashboard/student" element={<Student />} />
          <Route path="dashboard/teacher" element={<Teacher />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);