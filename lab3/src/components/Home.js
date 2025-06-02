import React from 'react';
import { useAuth } from '../context/AuthContext';

/* eslint-disable max-lines-per-function */

function Home() {
    const { currentUser } = useAuth();

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="welcome-section">
                    <h1 className="welcome-title">
                        Welcome,
                        {' '}
                        {currentUser?.username}
                        !
                    </h1>
                    <p className="welcome-subtitle">
                        You are logged in as a
                        {' '}
                        <span className="role-badge">{currentUser?.role}</span>
                    </p>
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <h3>User Information</h3>
                        <div className="info-item">
                            <strong>Username:</strong>
                            {' '}
                            {currentUser?.username}
                        </div>
                        <div className="info-item">
                            <strong>Email:</strong>
                            {' '}
                            {currentUser?.email}
                        </div>
                        <div className="info-item">
                            <strong>Role:</strong>
                            {' '}
                            {currentUser?.role}
                        </div>
                        <div className="info-item">
                            <strong>Member since:</strong>
                            {' '}
                            {currentUser?.createdAt
                                && new Date(currentUser.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Application Features</h3>
                        <ul className="feature-list">
                            <li>✓ User Authentication (Login/Logout)</li>
                            <li>✓ User Registration</li>
                            <li>✓ Role-based Access Control</li>
                            <li>✓ User Management (CRUD)</li>
                            <li>✓ Responsive Design</li>
                            <li>✓ Modern React with Hooks</li>
                            <li>✓ React Router for Navigation</li>
                            <li>✓ Local Storage Persistence</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h3>Technology Stack</h3>
                        <div className="tech-stack">
                            <span className="tech-item">React 18</span>
                            <span className="tech-item">React Router v6</span>
                            <span className="tech-item">Context API</span>
                            <span className="tech-item">CSS3</span>
                            <span className="tech-item">JavaScript ES6+</span>
                            <span className="tech-item">Local Storage</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
