import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Lab1DataProvider, useLab1Data } from './Lab1DataContext';
import '@testing-library/jest-dom/extend-expect';

// A helper component to test context functions
function TestComponent() {
    const {
        users, addUser, updateUser, deleteUser,
        payments, addPayment, updatePayment, deletePayment,
        schedules, addSchedule, updateSchedule, deleteSchedule,
        tests, addTest, updateTest, deleteTest
    } = useLab1Data();

    return (
        <div>
            <div data-testid="users-count">{users.length}</div>
            <button onClick={() => addUser({ name: 'Test User', email: 'test@example.com' })}>Add User</button>
            <button onClick={() => updateUser({ id: users[0].id, name: 'Updated', email: 'u@example.com' })}>Update User</button>
            <button onClick={() => deleteUser(users[0].id)}>Delete User</button>

            <div data-testid="payments-count">{payments.length}</div>
            <button onClick={() => addPayment({ userId: '1', amount: 50, date: '2025-06-01' })}>Add Payment</button>
            <button onClick={() => updatePayment({ id: payments[0].id, userId: '1', amount: 99, date: '2025-06-02' })}>Update Payment</button>
            <button onClick={() => deletePayment(payments[0].id)}>Delete Payment</button>

            <div data-testid="schedules-count">{schedules.length}</div>
            <button onClick={() => addSchedule({ userId: '1', date: '2025-07-01', topic: 'Topic' })}>Add Schedule</button>
            <button onClick={() => updateSchedule({ id: schedules[0].id, userId: '1', date: '2025-07-02', topic: 'Updated' })}>Update Schedule</button>
            <button onClick={() => deleteSchedule(schedules[0].id)}>Delete Schedule</button>

            <div data-testid="tests-count">{tests.length}</div>
            <button onClick={() => addTest({ userId: '1', score: 100, date: '2025-07-03' })}>Add Test</button>
            <button onClick={() => updateTest({ id: tests[0].id, userId: '1', score: 75, date: '2025-07-04' })}>Update Test</button>
            <button onClick={() => deleteTest(tests[0].id)}>Delete Test</button>
        </div>
    );
}

describe('Lab1DataContext CRUD operations', () => {
    beforeEach(() => {
        render(
            <Lab1DataProvider>
                <TestComponent />
            </Lab1DataProvider>
        );
    });

    test('initial data counts are correct', () => {
        expect(screen.getByTestId('users-count')).toHaveTextContent('3');
        expect(screen.getByTestId('payments-count')).toHaveTextContent('2');
        expect(screen.getByTestId('schedules-count')).toHaveTextContent('2');
        expect(screen.getByTestId('tests-count')).toHaveTextContent('2');
    });

    test('add, update, delete user works', () => {
        const count = screen.getByTestId('users-count');
        fireEvent.click(screen.getByText('Add User'));
        expect(count).toHaveTextContent('4');
        fireEvent.click(screen.getByText('Update User'));
        // No change in count
        expect(count).toHaveTextContent('4');
        fireEvent.click(screen.getByText('Delete User'));
        expect(count).toHaveTextContent('3');
    });

    test('add, update, delete payment works', () => {
        const count = screen.getByTestId('payments-count');
        fireEvent.click(screen.getByText('Add Payment'));
        expect(count).toHaveTextContent('3');
        fireEvent.click(screen.getByText('Update Payment'));
        expect(count).toHaveTextContent('3');
        fireEvent.click(screen.getByText('Delete Payment'));
        expect(count).toHaveTextContent('2');
    });

    test('add, update, delete schedule works', () => {
        const count = screen.getByTestId('schedules-count');
        fireEvent.click(screen.getByText('Add Schedule'));
        expect(count).toHaveTextContent('3');
        fireEvent.click(screen.getByText('Update Schedule'));
        expect(count).toHaveTextContent('3');
        fireEvent.click(screen.getByText('Delete Schedule'));
        expect(count).toHaveTextContent('2');
    });

    test('add, update, delete test works', () => {
        const count = screen.getByTestId('tests-count');
        fireEvent.click(screen.getByText('Add Test'));
        expect(count).toHaveTextContent('3');
        fireEvent.click(screen.getByText('Update Test'));
        expect(count).toHaveTextContent('3');
        fireEvent.click(screen.getByText('Delete Test'));
        expect(count).toHaveTextContent('2');
    });
});
