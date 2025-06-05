import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditUser from './EditUser';
import { useLab1Data } from '../../context/Lab1DataContext';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../../context/Lab1DataContext');

describe('EditUser component', () => {
  const updateUserMock = jest.fn();
  const navigateMock = jest.fn();
  const sampleUsers = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'student', phone: '123', address: 'Addr' },
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
    useLab1Data.mockReturnValue({ users: sampleUsers, updateUser: updateUserMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('renders form with user data and submits update', () => {
    useParams.mockReturnValue({ id: '1' });
    render(<EditUser />);

    // initial field values
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('alice@example.com')).toBeInTheDocument();
    // For select elements, check that the correct option is selected
    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect.value).toBe('student');    // change and submit
    fireEvent.change(screen.getByPlaceholderText(/Enter full name/i), { target: { value: 'Alice Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /Update User/i }));

    expect(updateUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Alice Updated' })
    );
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });

  test('shows user not found message and back button', () => {
    useParams.mockReturnValue({ id: '2' });
    render(<EditUser />);

    expect(screen.getByText(/User not found with ID/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Back to User List/i));
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });
});
