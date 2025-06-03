import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Lab1Layout.css';

const Lab1Layout = () => (
  <div className="lab1-container">
    <nav className="lab1-nav">
      <h2>Lab 1 Dashboard</h2>
      <ul>
        <li><NavLink to="" end>Home</NavLink></li>
        <li><NavLink to="users">Users</NavLink></li>
        <li><NavLink to="create-user">Create User</NavLink></li>
        <li><NavLink to="tutors">Tutors</NavLink></li>
        <li><NavLink to="payments">Payments</NavLink></li>
        <li><NavLink to="student-schedules">Schedules</NavLink></li>
        <li><NavLink to="tests">Tests</NavLink></li>
        <li><NavLink to="test-statistics">Test Statistics</NavLink></li>
      </ul>
    </nav>
    <main className="lab1-main">
      <Outlet />
    </main>
  </div>
);

export default Lab1Layout;
