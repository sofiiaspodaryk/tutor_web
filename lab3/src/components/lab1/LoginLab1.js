import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginLab1.css';

function LoginLab1() {
    const navigate = useNavigate();
    return (
        <div className="login-lab1-container">
            <h2>Welcome to Interactive Dashboard</h2>
            <p>Manage users, tutors, payments, schedules, and test data seamlessly.</p>
            <button onClick={() => navigate('/dashboard')}>Enter Dashboard</button>
        </div>
    );
}

export default LoginLab1;
