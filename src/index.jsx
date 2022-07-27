import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './pages/login';
import Layout from './components/layout';
import { MessageStatistics } from './components/messageProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="dashboard/*" element={<MessageStatistics><Layout /></MessageStatistics>} />
      <Route path="*" element={<Navigate to="dashboard/" />} />
    </Routes>
  </Router>
);
