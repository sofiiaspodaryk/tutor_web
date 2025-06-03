/* eslint-disable max-lines-per-function */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(credentials);
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={credentials.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary btn-full"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don&apos;t have an account?
                        {' '}
                        <Link to="/register" className="auth-link">
                            Register here
                        </Link>
                    </p>
                </div>

                <div className="demo-accounts">
                  <h3>Demo Accounts:</h3>
                  <div className="demo-account">
                    <strong>Admin:</strong> username: <code>admin</code> / password: <code>admin</code>
                  </div>
                  <div className="demo-account">
                    <strong>Manager:</strong> username: <code>manager1</code> / password: <code>manager123</code>
                  </div>
                  <div className="demo-account">
                    <strong>Student:</strong> username: <code>student1</code> / password: <code>student123</code>
                  </div>
                  <div className="demo-account">
                    <strong>Tutor:</strong> username: <code>tutor1</code> / password: <code>tutor123</code>
                  </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
