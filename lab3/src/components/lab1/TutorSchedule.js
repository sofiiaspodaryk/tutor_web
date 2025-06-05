import React, { useState } from 'react';
import { useLab1Data } from '../../context/Lab1DataContext';

function TutorSchedule() {
    const {
        schedules, tutors, addSchedule, updateSchedule, deleteSchedule,
    } = useLab1Data();
    const [form, setForm] = useState({
        id: null, tutorId: '', date: '', topic: '',
    });
    const [editing, setEditing] = useState(false);

    const resetForm = () => {
        setForm({
            id: null, tutorId: '', date: '', topic: '',
        });
        setEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { userId: form.tutorId, date: form.date, topic: form.topic };
        if (editing) updateSchedule({ id: form.id, ...payload }); else addSchedule(payload);
        resetForm();
    };

    const startEdit = (s) => {
        setForm({
            id: s.id, tutorId: s.userId, date: s.date, topic: s.topic,
        });
        setEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this schedule?')) deleteSchedule(id);
    };

    return (
        <div>
            <h2>Tutor Schedules</h2>
            <button onClick={resetForm}>Add Schedule</button>
            <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                <div>
                    <label htmlFor="tutorId">Tutor:</label>
                    <select id="tutorId" name="tutorId" value={form.tutorId} onChange={handleChange} required>
                        <option value="">--Select--</option>
                        {tutors.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="topic">Topic:</label>
                    <input id="topic" name="topic" value={form.topic} onChange={handleChange} required />
                </div>
                <button type="submit">{editing ? 'Update' : 'Create'}</button>
                {editing && <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
            </form>
            <table className="table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tutor</th>
                        <th>Date</th>
                        <th>Topic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{tutors.find((t) => t.id === s.userId)?.name}</td>
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

export default TutorSchedule;
