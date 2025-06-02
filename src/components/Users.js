import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUsers, createUser, updateUser, deleteUser, ROLES } from '../services/mockData';

const Users = () => {
    const { currentUser, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: ROLES.USER,
        password: '',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await fetchUsers();
            setUsers(usersData);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            await loadUsers();
            setShowCreateForm(false);
            setFormData({ username: '', email: '', role: ROLES.USER, password: '' });
        } catch (err) {
            setError(err.message || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser(editingUser.id, formData);
            await loadUsers();
            setEditingUser(null);
            setFormData({ username: '', email: '', role: ROLES.USER, password: '' });
        } catch (err) {
            setError(err.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === currentUser.id) {
            setError('You cannot delete your own account');
            return;
        }

        // eslint-disable-next-line no-alert
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (!confirmed) return;

        try {
            await deleteUser(userId);
            await loadUsers();
        } catch (err) {
            setError(err.message || 'Failed to delete user');
        }
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            password: '',
        });
        setShowCreateForm(false);
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setShowCreateForm(false);
        setFormData({ username: '', email: '', role: ROLES.USER, password: '' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                {isAdmin() && (
                    <button
                        type="button"
                        onClick={() => setShowCreateForm(true)}
                        className="btn btn-primary"
                        disabled={editingUser}
                    >
                        Add New User
                    </button>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button type="button" onClick={() => setError('')} className="error-close">
                        ×
                    </button>
                </div>
            )}

            {(showCreateForm || editingUser) && (
                <div className="user-form-container">
                    <div className="user-form">
                        <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>
                        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="form-select"
                                >
                                    <option value={ROLES.USER}>User</option>
                                    <option value={ROLES.MANAGER}>Manager</option>
                                    {isAdmin() && <option value={ROLES.ADMIN}>Admin</option>}
                                </select>
                            </div>
                            {!editingUser && (
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="form-input"
                                        minLength={6}
                                    />
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                                <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                            {isAdmin() && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={user.id === currentUser.id ? 'current-user' : ''}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{formatDate(user.createdAt)}</td>
                                {isAdmin() && (
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(user)}
                                                className="btn btn-small btn-secondary"
                                                disabled={showCreateForm}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="btn btn-small btn-danger"
                                                disabled={user.id === currentUser.id || showCreateForm}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="empty-state">
                    <p>No users found.</p>
                </div>
            )}
        </div>
    );
};

export default Users;
