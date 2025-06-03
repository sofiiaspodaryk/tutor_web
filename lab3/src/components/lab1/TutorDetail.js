import React from 'react';
import { useParams } from 'react-router-dom';
import { useLab1Data } from '../../context/Lab1DataContext';

function TutorDetail() {
    const { id } = useParams();
    const { tutors, schedules } = useLab1Data();
    const tutor = tutors.find((t) => t.id === id);

    if (!tutor) return <div>Tutor not found</div>;

    const tutorSchedules = schedules.filter((s) => s.userId === id);

    return (
        <div>
            <h2>{tutor.name}</h2>
            <p>
                <strong>Subject:</strong>
                {' '}
                {tutor.subject}
            </p>
            <h3>Schedules</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Topic</th>
                    </tr>
                </thead>
                <tbody>
                    {tutorSchedules.map((s) => (
                        <tr key={s.id}>
                            <td>{s.date}</td>
                            <td>{s.topic}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TutorDetail;
