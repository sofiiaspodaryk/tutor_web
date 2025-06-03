import React, { useState } from 'react';
import { useLab1Data } from '../../context/Lab1DataContext';
import '../../styles/enhanced.css';

function Tests() {
    const {
        tests, users, addTest, updateTest, deleteTest,
    } = useLab1Data();
    const [form, setForm] = useState({
        id: null,
        userId: '',
        score: '',
        date: '',
        subject: '',
        duration: '',
        maxScore: '100',
    });
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.userId) newErrors.userId = 'Please select a student';
        if (!form.subject.trim()) newErrors.subject = 'Subject is required';
        if (!form.score || form.score < 0) newErrors.score = 'Score must be a positive number';
        if (!form.maxScore || form.maxScore < 1) newErrors.maxScore = 'Max score must be at least 1';
        if (parseInt(form.score) > parseInt(form.maxScore)) newErrors.score = 'Score cannot exceed max score';
        if (!form.date) newErrors.date = 'Date is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setForm({
            id: null,
            userId: '',
            score: '',
            date: '',
            subject: '',
            duration: '',
            maxScore: '100',
        });
        setEditing(false);
        setShowForm(false);
        setErrors({});
        setSuccessMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setErrors({});

        try {
            const payload = {
                userId: form.userId,
                score: parseInt(form.score, 10),
                date: form.date,
                subject: form.subject.trim(),
                duration: form.duration ? parseInt(form.duration, 10) : null,
                maxScore: parseInt(form.maxScore, 10),
            };

            if (editing) {
                updateTest({ id: form.id, ...payload });
                setSuccessMessage('Test updated successfully!');
            } else {
                addTest(payload);
                setSuccessMessage('Test created successfully!');
            }
            
            setTimeout(() => {
                resetForm();
            }, 1500);
        } catch (error) {
            console.error('Error saving test:', error);
            setErrors({ submit: 'Failed to save test. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (t) => {
        setForm({
            id: t.id,
            userId: t.userId,
            score: t.score.toString(),
            date: t.date,
            subject: t.subject || '',
            duration: t.duration || '',
            maxScore: t.maxScore?.toString() || '100',
        });
        setEditing(true);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            deleteTest(id);
        }
    };

    const getScoreStatus = (score, maxScore = 100) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 'excellent';
        if (percentage >= 80) return 'good';
        if (percentage >= 70) return 'average';
        return 'poor';
    };

    const getUserName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.name : 'Unknown User';
    };

    return (
        <div className="user-management-container fade-in-up">
            <div className="user-management-header">
                <div>
                    <h1 className="user-management-title">Tests & Assessments</h1>
                    <div className="user-stats">
                        <div className="user-stat">
                            <span className="user-stat-number">{tests.length}</span>
                            <span className="user-stat-label">Total Tests</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">
                                {tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + t.score, 0) / tests.length) : 0}
                            </span>
                            <span className="user-stat-label">Avg Score</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">
                                {tests.filter((t) => (t.score / (t.maxScore || 100)) >= 0.8).length}
                            </span>
                            <span className="user-stat-label">High Scores</span>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <span>+</span>
                    {' '}
                    {showForm ? 'Hide Form' : 'Add Test'}
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <div className="form-header">
                        <h2 className="form-title">
                            {editing ? '✏️ Edit Test' : '➕ Create New Test'}
                        </h2>
                        <p className="form-subtitle">
                            {editing ? 'Update test information and scores' : 'Record a new test or assessment result'}
                        </p>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success">
                            <span>✅</span>
                            {successMessage}
                        </div>
                    )}

                    {errors.submit && (
                        <div className="alert alert-error">
                            <span>❌</span>
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="user-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">👨‍🎓</span>
                                    Student *
                                </label>
                                <select
                                    name="userId"
                                    value={form.userId}
                                    onChange={handleChange}
                                    className={`form-select ${errors.userId ? 'error' : ''}`}
                                    required
                                >
                                    <option value="">-- Select Student --</option>
                                    {users.filter((u) => u.role === 'student').map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                {errors.userId && <span className="error-message">{errors.userId}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">📚</span>
                                    Subject *
                                </label>
                                <input
                                    name="subject"
                                    type="text"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="e.g., Mathematics, Science, History"
                                    className={`form-input ${errors.subject ? 'error' : ''}`}
                                    required
                                />
                                {errors.subject && <span className="error-message">{errors.subject}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">🎯</span>
                                    Score Achieved *
                                </label>
                                <input
                                    name="score"
                                    type="number"
                                    min="0"
                                    max={form.maxScore || 100}
                                    value={form.score}
                                    onChange={handleChange}
                                    placeholder="Enter score"
                                    className={`form-input ${errors.score ? 'error' : ''}`}
                                    required
                                />
                                {errors.score && <span className="error-message">{errors.score}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">💯</span>
                                    Maximum Score *
                                </label>
                                <input
                                    name="maxScore"
                                    type="number"
                                    min="1"
                                    value={form.maxScore}
                                    onChange={handleChange}
                                    placeholder="100"
                                    className={`form-input ${errors.maxScore ? 'error' : ''}`}
                                    required
                                />
                                {errors.maxScore && <span className="error-message">{errors.maxScore}</span>}
                                {form.score && form.maxScore && (
                                    <div className="score-preview">
                                        Percentage: {((parseInt(form.score) / parseInt(form.maxScore)) * 100).toFixed(1)}%
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">📅</span>
                                    Test Date *
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className={`form-input ${errors.date ? 'error' : ''}`}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.date && <span className="error-message">{errors.date}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">⏱️</span>
                                    Duration (minutes)
                                </label>
                                <input
                                    name="duration"
                                    type="number"
                                    min="1"
                                    max="600"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 60"
                                    className="form-input"
                                />
                                <small className="form-help">Optional - Leave blank if not applicable</small>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={resetForm}
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
                                        {editing ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <span>{editing ? '✓' : '+'}</span>
                                        {editing ? 'Update Test' : 'Create Test'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Subject</th>
                                <th>Score</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Performance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.length > 0 ? (
                                tests.map((test) => {
                                    const percentage = ((test.score / (test.maxScore || 100)) * 100).toFixed(1);
                                    const status = getScoreStatus(test.score, test.maxScore || 100);

                                    return (
                                        <tr key={test.id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-avatar">
                                                        {getUserName(test.userId).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-details">
                                                        <h4>{getUserName(test.userId)}</h4>
                                                        <p>
                                                            ID:
                                                            {test.userId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{test.subject || 'N/A'}</td>
                                            <td>
                                                <strong>
                                                    {test.score}
                                                    /
                                                    {test.maxScore || 100}
                                                </strong>
                                                <br />
                                                <small style={{ color: '#718096' }}>
                                                    (
                                                    {percentage}
                                                    %)
                                                </small>
                                            </td>
                                            <td>{test.date}</td>
                                            <td>{test.duration ? `${test.duration} min` : 'N/A'}</td>
                                            <td>
                                                <span className={`role-badge ${status === 'excellent' ? 'role-admin'
                                                    : status === 'good' ? 'role-tutor'
                                                        : status === 'average' ? 'role-student' : 'role-badge'}`}
                                                >
                                                    {status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => startEdit(test)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(test.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No tests available. Create your first test!
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

export default Tests;
