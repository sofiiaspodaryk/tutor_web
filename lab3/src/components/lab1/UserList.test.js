import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';
import { useLab1Data } from '../../context/Lab1DataContext';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../../context/Lab1DataContext');

describe('UserList component', () => {
  const deleteUserMock = jest.fn();
  const navigateMock = jest.fn();
  const sampleUsers = [
    { id: '1', name: 'Alice', email: 'a@example.com', role: 'student' },
    { id: '2', name: 'Bob', email: 'b@example.com', role: 'tutor' },
  ];

  beforeEach(() => {
    useLab1Data.mockReturnValue({ users: sampleUsers, deleteUser: deleteUserMock });
    useNavigate.mockReturnValue(navigateMock);
    render(<UserList />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders list with correct number of users', () => {
    expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2 rows
  });

  test('search filters users', () => {
    fireEvent.change(screen.getByPlaceholderText(/Search users/i), { target: { value: 'Alice' } });
    expect(screen.getAllByRole('row')).toHaveLength(2); // header + 1 row
  });

  test('create button navigates', () => {
    fireEvent.click(screen.getByText(/Create User/i));
    expect(navigateMock).toHaveBeenCalledWith('/create-user');
  });

  test('edit button navigates to edit page', () => {
    fireEvent.click(screen.getAllByText(/Edit/i)[0]);
    expect(navigateMock).toHaveBeenCalledWith('/edit-user/1');
  });

  test('delete button calls deleteUser when confirmed', () => {
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    expect(deleteUserMock).toHaveBeenCalledWith('1');
  });

  test('delete button does not call when cancelled', () => {
    window.confirm = jest.fn(() => false);
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    expect(deleteUserMock).not.toHaveBeenCalled();
  });
});
