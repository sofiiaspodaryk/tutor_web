import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TutorSchedule from './TutorSchedule';
import { useLab1Data } from '../../context/Lab1DataContext';

jest.mock('../../context/Lab1DataContext');

describe('TutorSchedule component', () => {
  const addScheduleMock = jest.fn();
  const updateScheduleMock = jest.fn();
  const deleteScheduleMock = jest.fn();
  
  const sampleSchedules = [
    { id: 's1', tutorId: 't1', date: '2025-06-10', topic: 'Math Tutoring' }
  ];
  const sampleTutors = [
    { id: 't1', name: 'John Tutor', role: 'tutor' }
  ];

  beforeEach(() => {
    useLab1Data.mockReturnValue({
      schedules: sampleSchedules,
      tutors: sampleTutors,
      addSchedule: addScheduleMock,
      updateSchedule: updateScheduleMock,
      deleteSchedule: deleteScheduleMock,
    });
  });

  afterEach(() => jest.clearAllMocks());

  test('renders tutor schedule title', () => {
    render(<TutorSchedule />);
    expect(screen.getByText(/Tutor Schedule/i)).toBeInTheDocument();
  });

  test('renders schedule table with data', () => {
    render(<TutorSchedule />);
    expect(screen.getByText('John Tutor')).toBeInTheDocument();
    expect(screen.getByText('Math Tutoring')).toBeInTheDocument();
    expect(screen.getByText('2025-06-10')).toBeInTheDocument();
  });
  test('renders form for adding schedule', () => {
    render(<TutorSchedule />);
    expect(screen.getByText(/Add Schedule/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /topic/i })).toBeInTheDocument();
  });
  test('adds new schedule on form submit', () => {
    render(<TutorSchedule />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /topic/i }), {
      target: { value: 'Science Tutoring' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 't1' }
    });
    fireEvent.click(screen.getByText(/Create/i));

    expect(addScheduleMock).toHaveBeenCalled();
  });
  test('edits existing schedule', () => {
    render(<TutorSchedule />);
    
    fireEvent.click(screen.getByText(/Edit/i));
    expect(screen.getByDisplayValue('Math Tutoring')).toBeInTheDocument();
    
    fireEvent.change(screen.getByDisplayValue('Math Tutoring'), {
      target: { value: 'Updated Topic' }
    });
    fireEvent.click(screen.getByText(/Update/i));

    expect(updateScheduleMock).toHaveBeenCalled();
  });

  test('deletes schedule on confirm', () => {
    window.confirm = jest.fn(() => true);
    render(<TutorSchedule />);
    
    fireEvent.click(screen.getByText(/Delete/i));
    expect(deleteScheduleMock).toHaveBeenCalledWith('s1');
  });

  test('cancels edit mode', () => {
    render(<TutorSchedule />);
    
    fireEvent.click(screen.getByText(/Edit/i));
    fireEvent.click(screen.getByText(/Cancel/i));
    
    expect(screen.getByText(/Add Schedule/i)).toBeInTheDocument();
  });
});
