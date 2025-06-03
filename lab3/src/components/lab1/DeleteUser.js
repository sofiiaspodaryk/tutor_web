import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLab1Data } from '../../context/Lab1DataContext';

function DeleteUser() {
    const { id } = useParams();
    const { users, deleteUser } = useLab1Data();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const user = users.find((u) => u.id === id);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            deleteUser(id);
            navigate('/user-list');
        } catch (error) {
            console.error('Error deleting user:', error);
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        navigate('/user-list');
    };

    if (!user) {
        return (
            <div className="user-management-container fade-in-up">
                <div className="form-card">
                    <div className="message message-error">
                        <span>⚠️</span>
                        User not found with ID:
                        {' '}
                        {id}
                    </div>
                    <div className="form-actions">
                        <button onClick={handleCancel} className="btn btn-primary">
                            Back to User List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management-container fade-in-up">
            <div className="form-card">
                <div className="form-header">
                    <div className="delete-icon">
                        🗑️
                    </div>
                    <h1 className="form-title" style={{ color: '#e53e3e' }}>Delete User</h1>
                    <p className="form-subtitle">This action cannot be undone</p>
                </div>

                <div className="message message-warning">
                    <span>⚠️</span>
                    Are you sure you want to permanently delete this user?
                </div>

                <div className="user-info-card">
                    <div className="user-info-item">
                        <span className="user-info-label">Name:</span>
                        <span className="user-info-value">{user.name}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label">Email:</span>
                        <span className="user-info-value">{user.email}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label">Role:</span>
                        <span className="user-info-value">{user.role || 'Student'}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label">ID:</span>
                        <span className="user-info-value">{user.id}</span>
                    </div>
                    {user.phone && (
                        <div className="user-info-item">
                            <span className="user-info-label">Phone:</span>
                            <span className="user-info-value">{user.phone}</span>
                        </div>
                    )}
                    {user.address && (
                        <div className="user-info-item">
                            <span className="user-info-label">Address:</span>
                            <span className="user-info-value">{user.address}</span>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-danger"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <div className="loading-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <span>🗑️</span>
                                Yes, Delete User
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteUser;
