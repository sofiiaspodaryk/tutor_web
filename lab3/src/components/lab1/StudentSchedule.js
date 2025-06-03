import React, { useState } from 'react';
import { useLab1Data } from '../../context/Lab1DataContext';

function StudentSchedule() {
    const {
        schedules, users, addSchedule, updateSchedule, deleteSchedule,
    } = useLab1Data();
    const [form, setForm] = useState({
        id: null, userId: '', date: '', topic: '',
    });
    const [editing, setEditing] = useState(false);

    const resetForm = () => {
        setForm({
            id: null, userId: '', date: '', topic: '',
        });
        setEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { userId: form.userId, date: form.date, topic: form.topic };
        if (editing) updateSchedule({ id: form.id, ...payload }); else addSchedule(payload);
        resetForm();
    };

    const startEdit = (s) => {
        setForm({
            id: s.id, userId: s.userId, date: s.date, topic: s.topic,
        });
        setEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this schedule?')) deleteSchedule(id);
    };

    return (
        <div>
            <h2>Student Schedules</h2>
            <button onClick={resetForm}>Add Schedule</button>
            <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                <div>
                    <label>User:</label>
                    <select name="userId" value={form.userId} onChange={handleChange} required>
                        <option value="">--Select--</option>
                        {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
                <div>
                    <label>Date:</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Topic:</label>
                    <input name="topic" value={form.topic} onChange={handleChange} required />
                </div>
                <button type="submit">{editing ? 'Update' : 'Create'}</button>
                {editing && <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
            </form>
            <table className="table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Topic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{users.find((u) => u.id === s.userId)?.name}</td>
                            <td>{s.date}</td>
                            <td>{s.topic}</td>
                            <td>
                                <button onClick={() => startEdit(s)}>Edit</button>
                                <button onClick={() => handleDelete(s.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentSchedule;
