import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
                        <Link
                            to="/home"
                            className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/users"
                            className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                        >
                            Users
                        </Link>
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
