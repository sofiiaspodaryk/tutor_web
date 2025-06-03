import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLab1Data } from '../../context/Lab1DataContext';

function UserList() {
    const { users, deleteUser } = useLab1Data();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleEdit = (id) => {
        navigate(`/edit-user/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
        }
    };

    const handleCreateUser = () => {
        navigate('/create-user');
    };

    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())
    || user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const getUserAvatar = (name) => name.charAt(0).toUpperCase();

    const getRoleBadgeClass = (role) => {
        switch (role?.toLowerCase()) {
        case 'admin':
            return 'role-badge role-admin';
        case 'tutor':
            return 'role-badge role-tutor';
        case 'student':
            return 'role-badge role-student';
        default:
            return 'role-badge role-student';
        }
    };

    return (
        <div className="user-management-container fade-in-up">
            <div className="user-management-header">
                <div>
                    <h1 className="user-management-title">User Management</h1>
                    <div className="user-stats">
                        <div className="user-stat">
                            <span className="user-stat-number">{users.length}</span>
                            <span className="user-stat-label">Total Users</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">{users.filter((u) => u.role === 'admin').length}</span>
                            <span className="user-stat-label">Admins</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">{users.filter((u) => u.role === 'tutor').length}</span>
                            <span className="user-stat-label">Tutors</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">{users.filter((u) => u.role === 'student').length}</span>
                            <span className="user-stat-label">Students</span>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleCreateUser}>
                    <span>+</span>
                    {' '}
                    Create User
                </button>
            </div>

            <div className="card users-table-card">
                <div className="users-table-header">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {getUserAvatar(user.name)}
                                                </div>
                                                <div className="user-details">
                                                    <h4>{user.name}</h4>
                                                    <p>
                                                        ID:
                                                        {user.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={getRoleBadgeClass(user.role)}>
                                                {user.role || 'Student'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                        {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserList;
