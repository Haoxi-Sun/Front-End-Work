import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./login";
import Dashboard from "./dashboard/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Login />} />
        <Route path="dashboard/*" element={<Dashboard />}/>
        <Route path="*" element={<Navigate to="dashboard/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
