import React from 'react';
import { useLab1Data } from '../../context/Lab1DataContext';

function TestStatistic() {
    const { tests, users } = useLab1Data();
    const count = tests.length;
    const totalScore = tests.reduce((sum, t) => sum + t.score, 0);
    const avgScore = count > 0 ? (totalScore / count).toFixed(2) : 0;
    const scores = tests.map((t) => t.score);
    const maxScore = scores.length ? Math.max(...scores) : 0;
    const minScore = scores.length ? Math.min(...scores) : 0;

    // Per-user stats
    const userStats = users.map((u) => {
        const userTests = tests.filter((t) => t.userId === u.id);
        const cnt = userTests.length;
        const sum = userTests.reduce((s, t) => s + t.score, 0);
        return {
            id: u.id,
            name: u.name,
            count: cnt,
            avg: cnt > 0 ? (sum / cnt).toFixed(2) : 'N/A',
        };
    });

    return (
        <div>
            <h2>Test Statistics</h2>
            <div style={{ marginBottom: '20px' }}>
                <p>
                    <strong>Total Tests:</strong>
                    {' '}
                    {count}
                </p>
                <p>
                    <strong>Average Score:</strong>
                    {' '}
                    {avgScore}
                </p>
                <p>
                    <strong>Highest Score:</strong>
                    {' '}
                    {maxScore}
                </p>
                <p>
                    <strong>Lowest Score:</strong>
                    {' '}
                    {minScore}
                </p>
            </div>
            <h3>Per User Statistics</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Tests Taken</th>
                        <th>Average Score</th>
                    </tr>
                </thead>
                <tbody>
                    {userStats.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.count}</td>
                            <td>{u.avg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TestStatistic;
