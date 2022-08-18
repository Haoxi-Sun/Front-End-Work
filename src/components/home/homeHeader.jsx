import { Affix } from 'antd';
import React, { useState } from 'react';
import {useLocation} from 'react-router-dom';

export default function HomeHeader() {
  const path = useLocation().pathname;
  const isGallery = path === '/gallery';
  const isEvents = path === '/events';
  const isLogin = path === '/login';
  const isSignup = path === '/signup';
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <>
      <Affix
        offsetTop={0}
        onChange={(value) => {
            setIsScrolled(value);
        }}
      >
        <header
          id="header"
          className={isScrolled || isLogin || isSignup ? 'dark-header' : 'light-header'}
        >
          <div className="container">
            <a href="/" id="logo" title="HarrisonHighSchool">
              HarrisonHighSchool
            </a>
            <div className="menu-trigger"></div>
            <nav id="menu">
              <ul>
                <li>
                  <a href="">Courses</a>
                </li>
                <li className={isEvents ? 'current' : ''}>
                  <a href="/events">Events</a>
                </li>
              </ul>
              <ul>
                <li className={isGallery ? 'current' : ''}>
                  <a href="/gallery" >Student</a>
                </li>
                <li>
                  <a href="">Teachers</a>
                </li>
                <li id="login_header" className={isLogin ? 'current' : ''}>
                  <a href="/login">
                    Sign In
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </Affix>
    </>
  );
}
