import React, { useState } from 'react';
import { useLab1Data } from '../../context/Lab1DataContext';
import '../../styles/enhanced.css';

function Payment() {
    const {
        payments, addPayment, updatePayment, deletePayment, users,
    } = useLab1Data();
    const [form, setForm] = useState({
        id: null,
        userId: '',
        amount: '',
        date: '',
        description: '',
        paymentMethod: 'credit_card',
        status: 'completed',
        transactionId: '',
    });
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const paymentMethods = [
        { value: 'credit_card', label: '💳 Credit Card', icon: '💳' },
        { value: 'debit_card', label: '💰 Debit Card', icon: '💰' },
        { value: 'paypal', label: '🅿️ PayPal', icon: '🅿️' },
        { value: 'bank_transfer', label: '🏦 Bank Transfer', icon: '🏦' },
        { value: 'cash', label: '💵 Cash', icon: '💵' },
        { value: 'check', label: '📄 Check', icon: '📄' },
    ];

    const paymentStatuses = [
        { value: 'completed', label: '✅ Completed', color: 'success' },
        { value: 'pending', label: '⏳ Pending', color: 'warning' },
        { value: 'failed', label: '❌ Failed', color: 'error' },
        { value: 'refunded', label: '↩️ Refunded', color: 'info' },
    ];

    const generateTransactionId = () => {
        const prefix = form.paymentMethod.toUpperCase().slice(0, 3);
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.userId) newErrors.userId = 'Please select a user';
        if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
        if (!form.date) newErrors.date = 'Date is required';
        if (!form.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
        if (!form.status) newErrors.status = 'Payment status is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setForm({
            id: null,
            userId: '',
            amount: '',
            date: '',
            description: '',
            paymentMethod: 'credit_card',
            status: 'completed',
            transactionId: '',
        });
        setEditing(false);
        setShowForm(false);
        setErrors({});
        setSuccessMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ 
            ...f, 
            [name]: value,
            ...(name === 'paymentMethod' && !editing ? { transactionId: generateTransactionId() } : {}),
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
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
                amount: parseFloat(form.amount),
                date: form.date,
                description: form.description.trim(),
                paymentMethod: form.paymentMethod,
                status: form.status,
                transactionId: form.transactionId || generateTransactionId(),
            };

            if (editing) {
                updatePayment({ id: form.id, ...payload });
                setSuccessMessage('Payment updated successfully!');
            } else {
                addPayment(payload);
                setSuccessMessage('Payment recorded successfully!');
            }
            
            setTimeout(() => {
                resetForm();
            }, 1500);
        } catch (error) {
            console.error('Error saving payment:', error);
            setErrors({ submit: 'Failed to save payment. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (payment) => {
        setForm({
            id: payment.id,
            userId: payment.userId,
            amount: payment.amount.toString(),
            date: payment.date,
            description: payment.description || '',
            paymentMethod: payment.paymentMethod || 'credit_card',
            status: payment.status || 'completed',
            transactionId: payment.transactionId || '',
        });
        setEditing(true);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this payment record?')) {
            deletePayment(id);
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
        case 'completed':
            return 'role-badge role-student';
        case 'pending':
            return 'role-badge role-tutor';
        case 'failed':
            return 'role-badge role-admin';
        default:
            return 'role-badge';
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method?.toLowerCase()) {
        case 'credit_card':
            return '💳';
        case 'debit_card':
            return '💳';
        case 'paypal':
            return '🏦';
        case 'bank_transfer':
            return '🏛️';
        case 'cash':
            return '💵';
        default:
            return '💰';
        }
    };

    const getUserName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.name : 'Unknown User';
    };

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = payments.filter((p) => p.status === 'completed');
    const pendingPayments = payments.filter((p) => p.status === 'pending');

    return (
        <div className="user-management-container fade-in-up">
            <div className="user-management-header">
                <div>
                    <h1 className="user-management-title">Payment Management</h1>
                    <div className="user-stats">
                        <div className="user-stat">
                            <span className="user-stat-number">{payments.length}</span>
                            <span className="user-stat-label">Total Payments</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">{formatCurrency(totalAmount)}</span>
                            <span className="user-stat-label">Total Revenue</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">{completedPayments.length}</span>
                            <span className="user-stat-label">Completed</span>
                        </div>
                        <div className="user-stat">
                            <span className="user-stat-number">{pendingPayments.length}</span>
                            <span className="user-stat-label">Pending</span>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <span>+</span>
                    {' '}
                    {showForm ? 'Hide Form' : 'Add Payment'}
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <div className="form-header">
                        <h2 className="form-title">
                            {editing ? '✏️ Edit Payment' : '💰 Record New Payment'}
                        </h2>
                        <p className="form-subtitle">
                            {editing ? 'Update payment information and transaction details' : 'Add a new payment record with comprehensive details'}
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
                                <label htmlFor="userId" className="form-label">
                                    <span className="input-icon">👤</span>
                                    Student/User *
                                </label>
                                <select
                                    id="userId"
                                    name="userId"
                                    value={form.userId}
                                    onChange={handleChange}
                                    className={`form-select ${errors.userId ? 'error' : ''}`}
                                    required
                                >
                                    <option value="">-- Select User --</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.role})
                                        </option>
                                    ))}
                                </select>
                                {errors.userId && <span className="error-message">{errors.userId}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount" className="form-label">
                                    <span className="input-icon">💵</span>
                                    Amount (USD) *
                                </label>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="99999.99"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`form-input ${errors.amount ? 'error' : ''}`}
                                    required
                                />
                                {errors.amount && <span className="error-message">{errors.amount}</span>}
                                {form.amount && (
                                    <div className="amount-preview">
                                        {formatCurrency(parseFloat(form.amount) || 0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">💳</span>
                                    Payment Method *
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={form.paymentMethod}
                                    onChange={handleChange}
                                    className={`form-select ${errors.paymentMethod ? 'error' : ''}`}
                                    required
                                >
                                    {paymentMethods.map((method) => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="input-icon">📊</span>
                                    Payment Status *
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className={`form-select ${errors.status ? 'error' : ''}`}
                                    required
                                >
                                    {paymentStatuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <span className="error-message">{errors.status}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="date">
                                    <span className="input-icon">📅</span>
                                    Payment Date *
                                </label>
                                <input
                                    id="date"
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
                                    <span className="input-icon">🔗</span>
                                    Transaction ID
                                </label>
                                <input
                                    name="transactionId"
                                    type="text"
                                    value={form.transactionId}
                                    onChange={handleChange}
                                    placeholder="Auto-generated if left empty"
                                    className="form-input transaction-id"
                                    style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
                                />
                                <small className="form-help">Leave blank to auto-generate</small>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="description" className="form-label">
                                    <span className="input-icon">📝</span>
                                    Description/Notes
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Additional details about this payment..."
                                    className="form-textarea"
                                    rows="3"
                                    maxLength="500"
                                />
                                <small className="form-help">
                                    {form.description.length}/500 characters
                                </small>
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
                                        {editing ? 'Updating...' : 'Recording...'}
                                    </>
                                ) : (
                                    <>
                                        <span>{editing ? '✓' : '💰'}</span>
                                        {editing ? 'Update Payment' : 'Record Payment'}
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
                                <th>User</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Transaction ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {getUserName(payment.userId).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-details">
                                                    <h4>{getUserName(payment.userId)}</h4>
                                                    <p>{payment.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{formatCurrency(payment.amount)}</strong>
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                                {payment.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{payment.date}</td>
                                        <td>
                                            <span className={getStatusBadgeClass(payment.status)}>
                                                {payment.status?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td>
                                            <code style={{
                                                fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px',
                                            }}
                                            >
                                                {payment.transactionId || 'N/A'}
                                            </code>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => startEdit(payment)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(payment.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No payments recorded yet. Add your first payment!
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

export default Payment;
