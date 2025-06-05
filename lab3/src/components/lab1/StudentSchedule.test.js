import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentSchedule from './StudentSchedule';
import { useLab1Data } from '../../context/Lab1DataContext';

jest.mock('../../context/Lab1DataContext');

describe('StudentSchedule component', () => {
  const addScheduleMock = jest.fn();
  const updateScheduleMock = jest.fn();
  const deleteScheduleMock = jest.fn();
  const sampleUsers = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];
  const sampleSchedules = [
    { id: 'a', userId: '1', date: '2025-06-10', topic: 'Math' },
    { id: 'b', userId: '2', date: '2025-06-11', topic: 'Science' },
  ];

  beforeEach(() => {
    useLab1Data.mockReturnValue({
      users: sampleUsers,
      schedules: sampleSchedules,
      addSchedule: addScheduleMock,
      updateSchedule: updateScheduleMock,
      deleteSchedule: deleteScheduleMock,
    });
    render(<StudentSchedule />);
  });

  afterEach(() => jest.clearAllMocks());

  test('renders initial schedules', () => {
    expect(screen.getByText('Student Schedules')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  test('adds a schedule', () => {
    fireEvent.click(screen.getByText('Add Schedule'));
    // select user
    fireEvent.change(screen.getByLabelText('User:'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Date:'), { target: { value: '2025-07-01' } });
    fireEvent.change(screen.getByLabelText('Topic:'), { target: { value: 'History' } });
    fireEvent.click(screen.getByText('Create'));
    expect(addScheduleMock).toHaveBeenCalledWith({ userId: '1', date: '2025-07-01', topic: 'History' });
  });

  test('edits a schedule', () => {
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(screen.getByDisplayValue('Math')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Topic:'), { target: { value: 'Algebra' } });
    fireEvent.click(screen.getByText('Update'));
    expect(updateScheduleMock).toHaveBeenCalledWith({ id: 'a', userId: '1', date: '2025-06-10', topic: 'Algebra' });
  });

  test('deletes a schedule on confirm', () => {
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(deleteScheduleMock).toHaveBeenCalledWith('a');
  });

  test('does not delete schedule when cancel', () => {
    window.confirm = jest.fn(() => false);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(deleteScheduleMock).not.toHaveBeenCalled();
  });
});
