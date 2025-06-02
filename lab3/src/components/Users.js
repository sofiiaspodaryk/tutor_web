import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/mockData';

const Users = () => {
    const { currentUser, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'user',
    });
    const [isCreating, setIsCreating] = useState(false);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser({ ...formData, password: 'defaultpass123' });
            }
            
            setFormData({ username: '', email: '', role: 'user' });
            setEditingUser(null);
            setIsCreating(false);
            await loadUsers();
        } catch (err) {
            setError(err.message || 'Operation failed');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
        });
        setIsCreating(true);
    };

    const handleDelete = async (userId) => {
        if (userId === currentUser?.id) {
            setError('You cannot delete your own account');
            return;
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                await loadUsers();
            } catch (err) {
                setError(err.message || 'Delete failed');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({ username: '', email: '', role: 'user' });
        setIsCreating(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>User Management</h1>
                {isAdmin() && (
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="btn btn-primary"
                        disabled={isCreating}
                    >
                        Add New User
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {isCreating && (
                <div className="user-form-container">
                    <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={handleSubmit} className="user-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                {isAdmin() && <option value="admin">Admin</option>}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingUser ? 'Update User' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                            {isAdmin() && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={user.id === currentUser?.id ? 'current-user' : ''}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                {isAdmin() && (
                                    <td className="actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(user)}
                                            className="btn btn-sm btn-outline"
                                            disabled={isCreating}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(user.id)}
                                            className="btn btn-sm btn-danger"
                                            disabled={user.id === currentUser?.id || isCreating}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="users-summary">
                <p>Total Users: {users.length}</p>
                <p>Your Role: {currentUser?.role}</p>
            </div>
        </div>
    );
};

export default Users;
