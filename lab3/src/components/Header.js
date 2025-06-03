import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/mockData';

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="logo">Web2 Lab3 SPA</h1>
                    <nav className="nav">
                        <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>Home</Link>
                        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                        
                        {/* Manager role sees user management */}
                        {currentUser?.role === ROLES.MANAGER && (
                            <>
                                <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>User Management</Link>
                                <Link to="/user-list" className={`nav-link ${isActive('/user-list') ? 'active' : ''}`}>User List</Link>
                                <Link to="/create-user" className={`nav-link ${isActive('/create-user') ? 'active' : ''}`}>Create User</Link>
                                <Link to="/tutor-list" className={`nav-link ${isActive('/tutor-list') ? 'active' : ''}`}>Tutors</Link>
                            </>
                        )}
                        
                        {/* Student can see tests and schedule */}
                        {currentUser?.role === ROLES.STUDENT && (
                            <>
                                <Link to="/tests" className={`nav-link ${isActive('/tests') ? 'active' : ''}`}>Tests</Link>
                                <Link to="/student-schedule" className={`nav-link ${isActive('/student-schedule') ? 'active' : ''}`}>Schedule</Link>
                                <Link to="/payment" className={`nav-link ${isActive('/payment') ? 'active' : ''}`}>Payments</Link>
                            </>
                        )}
                        
                        {/* Tutor can see test statistics and tutor schedule */}
                        {currentUser?.role === ROLES.TUTOR && (
                            <>
                                <Link to="/test-statistic" className={`nav-link ${isActive('/test-statistic') ? 'active' : ''}`}>Statistics</Link>
                                <Link to="/tutor-schedule" className={`nav-link ${isActive('/tutor-schedule') ? 'active' : ''}`}>My Schedule</Link>
                            </>
                        )}
                        
                        {/* Admin can see everything */}
                        {currentUser?.role === ROLES.ADMIN && (
                            <>
                                <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>User Management</Link>
                                <Link to="/user-list" className={`nav-link ${isActive('/user-list') ? 'active' : ''}`}>User List</Link>
                                <Link to="/tutor-list" className={`nav-link ${isActive('/tutor-list') ? 'active' : ''}`}>Tutors</Link>
                                <Link to="/tests" className={`nav-link ${isActive('/tests') ? 'active' : ''}`}>Tests</Link>
                                <Link to="/test-statistic" className={`nav-link ${isActive('/test-statistic') ? 'active' : ''}`}>Statistics</Link>
                                <Link to="/payment" className={`nav-link ${isActive('/payment') ? 'active' : ''}`}>Payments</Link>
                            </>
                        )}
                    </nav>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span className="user-name">
                            {currentUser?.username}
                        </span>
                        <span className="user-role">
                            (
                            {currentUser?.role}
                            )
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
