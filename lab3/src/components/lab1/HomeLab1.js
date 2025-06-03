import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLab1Data } from '../../context/Lab1DataContext';
import { useAuth } from '../../context/AuthContext';

function HomeLab1() {
    const {
        users, tutors, payments, schedules, tests,
    } = useLab1Data();
    const { user } = useAuth();
    const navigate = useNavigate();

    const dashboardStats = [
        {
            title: 'Total Users',
            value: users.length,
            icon: '👥',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            onClick: () => navigate('/user-list'),
        },
        {
            title: 'Active Tutors',
            value: tutors.length,
            icon: '👨‍🏫',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            onClick: () => navigate('/tutor-list'),
        },
        {
            title: 'Payments',
            value: payments.length,
            icon: '💳',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            onClick: () => navigate('/payment'),
        },
        {
            title: 'Schedules',
            value: schedules.length,
            icon: '📅',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            onClick: () => navigate('/student-schedule'),
        },
        {
            title: 'Tests',
            value: tests.length,
            icon: '📝',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            onClick: () => navigate('/tests'),
        },
    ];

    const recentActivities = [
        { action: 'New user registered', time: '2 hours ago', icon: '👤' },
        { action: 'Payment processed', time: '4 hours ago', icon: '💰' },
        { action: 'Schedule updated', time: '6 hours ago', icon: '📅' },
        { action: 'Test completed', time: '1 day ago', icon: '✅' },
    ];

    const quickActions = [
        {
            title: 'Create User', path: '/create-user', icon: '👤', color: '#667eea',
        },
        {
            title: 'View Tutors', path: '/tutor-list', icon: '👨‍🏫', color: '#f5576c',
        },
        {
            title: 'Manage Tests', path: '/tests', icon: '📝', color: '#43e97b',
        },
        {
            title: 'View Statistics', path: '/test-statistic', icon: '📊', color: '#fa709a',
        },
    ];

    return (
        <div className="dashboard-container fade-in-up">
            {/* Welcome Header */}
            <div className="card">
                <div className="dashboard-welcome">
                    <h1 className="dashboard-title">
                        Welcome back,
                        {' '}
                        {user?.username || 'User'}
                        ! 👋
                    </h1>
                    <p className="dashboard-subtitle">
                        Here's what's happening in your learning management system today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard-grid">
                {dashboardStats.map((stat, index) => (
                    <div
                        key={stat.title}
                        className="dashboard-card"
                        onClick={stat.onClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <div
                            className="dashboard-card-icon"
                            style={{ background: stat.gradient }}
                        >
                            {stat.icon}
                        </div>
                        <h3 className="dashboard-card-title">{stat.title}</h3>
                        <div className="dashboard-card-value">{stat.value}</div>
                        <p className="dashboard-card-description">Click to view details</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Quick Actions</h2>
                        <p className="card-subtitle">Frequently used features</p>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {quickActions.map((action) => (
                            <button
                                key={action.title}
                                className="btn btn-outline"
                                onClick={() => navigate(action.path)}
                                style={{
                                    justifyContent: 'flex-start',
                                    gap: '1rem',
                                    borderColor: action.color,
                                    color: action.color,
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                                {action.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Activities</h2>
                        <p className="card-subtitle">Latest system updates</p>
                    </div>
                    <div className="data-list">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="list-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{activity.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{activity.action}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>{activity.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">System Overview</h2>
                    <p className="card-subtitle">Current system status and metrics</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🟢</div>
                        <div style={{ fontWeight: '600' }}>System Status</div>
                        <div style={{ color: '#38a169' }}>All Systems Operational</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                        <div style={{ fontWeight: '600' }}>Performance</div>
                        <div style={{ color: '#667eea' }}>Optimal</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                        <div style={{ fontWeight: '600' }}>Security</div>
                        <div style={{ color: '#38a169' }}>Secure</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
                        <div style={{ fontWeight: '600' }}>Storage</div>
                        <div style={{ color: '#667eea' }}>85% Available</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeLab1;
