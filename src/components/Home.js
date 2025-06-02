import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/mockData';

const Home = () => {
    const { currentUser } = useAuth();

    const getRoleDescription = (role) => {
        switch (role) {
            case ROLES.ADMIN:
                return 'You have full access to all system features including user management.';
            case ROLES.MANAGER:
                return 'You can manage users and access most system features.';
            case ROLES.USER:
                return 'You have standard user access to the system.';
            default:
                return 'Welcome to the system!';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    Welcome back,
                    {' '}
                    {currentUser?.username}
                    !
                </h1>
                <p className="welcome-subtitle">
                    {getRoleDescription(currentUser?.role)}
                </p>
            </div>

            <div className="info-cards">
                <div className="info-card">
                    <h3>Your Profile</h3>
                    <div className="profile-info">
                        <div className="profile-item">
                            <strong>Username:</strong>
                            {' '}
                            {currentUser?.username}
                        </div>
                        <div className="profile-item">
                            <strong>Email:</strong>
                            {' '}
                            {currentUser?.email}
                        </div>
                        <div className="profile-item">
                            <strong>Role:</strong>
                            {' '}
                            <span className={`role-badge role-${currentUser?.role}`}>
                                {currentUser?.role?.toUpperCase()}
                            </span>
                        </div>
                        <div className="profile-item">
                            <strong>Member since:</strong>
                            {' '}
                            {formatDate(currentUser?.createdAt)}
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h3>System Features</h3>
                    <ul className="features-list">
                        <li>✅ User Authentication</li>
                        <li>✅ Role-based Access Control</li>
                        <li>✅ User Management</li>
                        <li>✅ Responsive Design</li>
                        <li>✅ Single Page Application</li>
                        <li>✅ Mock Data Persistence</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => window.location.href = '/users'}
                        >
                            View Users
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h2>Application Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">6</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">3</div>
                        <div className="stat-label">User Roles</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Uptime</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {new Date().getFullYear()}
                        </div>
                        <div className="stat-label">Current Year</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
