import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLab1Data } from '../../context/Lab1DataContext';

function TutorList() {
    const { tutors } = useLab1Data();
    const navigate = useNavigate();

    return (
        <div>
            <h2>Tutors</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tutors.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.name}</td>
                            <td>{t.subject}</td>
                            <td><button onClick={() => navigate(`/tutor-detail/${t.id}`)}>View</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TutorList;
