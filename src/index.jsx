import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './pages/home/login';
import Layout from './components/layout';
import Home from './pages/home/home';
import Events from './pages/home/events';
import Gallery from './pages/home/gallery';
import { MessageStatistics } from './components/manager/messageProvider';
import SignUp from './pages/home/signup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="dashboard/*"
        element={
          <MessageStatistics>
            <Layout />
          </MessageStatistics>
        }
      />
      <Route path="*" element={<Navigate to="dashboard/" />} />
    </Routes>
  </Router>
);
