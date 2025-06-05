import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLab1Data } from '../../context/Lab1DataContext';
import PropTypes from 'prop-types';

function EditUser() {
    const { id } = useParams();
    const safeId = id || '';
    const { users, updateUser } = useLab1Data();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'student',
        phone: '',
        address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);

    useEffect(() => {
        const user = users.find((u) => u.id === safeId);
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'student',
                phone: user.phone || '',
                address: user.address || '',
            });
            setUserNotFound(false);
        } else {
            setUserNotFound(true);
        }
    }, [id, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            updateUser({ id, ...form });
            navigate('/user-list');
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/user-list');
    };

    if (userNotFound) {
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
                    <h1 className="form-title">Edit User</h1>
                    <p className="form-subtitle">Update user information</p>
                </div>

                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <span className="input-icon">👤</span>
                                Full Name
                            </label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <span className="input-icon">📧</span>
                                Email Address
                            </label>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <span className="input-icon">🎭</span>
                                Role
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="student">Student</option>
                                <option value="tutor">Tutor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <span className="input-icon">📱</span>
                                Phone Number
                            </label>
                            <div className="input-group">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <span className="input-icon">🏠</span>
                            Address
                        </label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter address (optional)"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="loading-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <span>💾</span>
                                    Update User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditUser.propTypes = {
    users: PropTypes.array.isRequired,
    updateUser: PropTypes.func.isRequired,
};

export default EditUser;
