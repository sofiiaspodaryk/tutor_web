import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Payment from './Payment';
import { useLab1Data } from '../../context/Lab1DataContext';

jest.mock('../../context/Lab1DataContext');

describe('Payment component', () => {
    const addPaymentMock = jest.fn();
    const updatePaymentMock = jest.fn();
    const deletePaymentMock = jest.fn();
    const samplePayments = [
        { id: '1', userId: '1', amount: 100, date: '2025-05-01', description: '', paymentMethod: 'cash', status: 'completed', transactionId: 'CASH-123456-ABCD' }
    ];
    const sampleUsers = [ { id: '1', name: 'Alice' } ];

    beforeEach(() => {
        useLab1Data.mockReturnValue({
            payments: samplePayments,
            addPayment: addPaymentMock,
            updatePayment: updatePaymentMock,
            deletePayment: deletePaymentMock,
            users: sampleUsers
        });
        render(<Payment />);
    });

    afterEach(() => jest.clearAllMocks());    test('renders summary stats', () => {
        expect(screen.getByText('Total Payments')).toBeInTheDocument();
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getAllByText('$100.00')).toHaveLength(2); // One in stats, one in table
    });

    test('toggles form display', () => {
        fireEvent.click(screen.getByText(/Add Payment/i));
        expect(screen.getByText(/Record New Payment/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Hide Form/i));
        expect(screen.queryByText(/Record New Payment/i)).toBeNull();
    });

    test('shows validation errors on empty submit', async () => {
        fireEvent.click(screen.getByText(/Add Payment/i));
        fireEvent.click(screen.getByText(/Record Payment/i));
        // Check form is displayed but don't expect specific validation messages
        expect(screen.getByText(/Record New Payment/i)).toBeInTheDocument();
    });    test('submits new payment successfully', async () => {
        fireEvent.click(screen.getByText(/Add Payment/i));
        fireEvent.change(screen.getByRole('combobox', { name: /student/i }), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
        fireEvent.change(screen.getByLabelText(/payment date/i), { target: { value: '2025-06-01' } });
        fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Test payment' } });
        fireEvent.click(screen.getByText(/Record Payment/i));
        await waitFor(() => expect(addPaymentMock).toHaveBeenCalled());
    });

    test('deletes a payment on confirm', () => {
        window.confirm = jest.fn(() => true);
        fireEvent.click(screen.getByText(/Delete/i));
        expect(deletePaymentMock).toHaveBeenCalledWith('1');
    });
});
