import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteUser from './DeleteUser';
import { useLab1Data } from '../../context/Lab1DataContext';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../../context/Lab1DataContext');

describe('DeleteUser component', () => {
  const deleteUserMock = jest.fn();
  const navigateMock = jest.fn();
  const sampleUsers = [{ id: '1', name: 'Alice', email: 'alice@example.com', role: 'student' }];

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
    useLab1Data.mockReturnValue({ users: sampleUsers, deleteUser: deleteUserMock });
  });

  afterEach(() => jest.clearAllMocks());

  test('renders warning for non-existent user and back button works', () => {
    useParams.mockReturnValue({ id: '2' });
    render(<DeleteUser />);
    expect(screen.getByText(/User not found with ID/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Back to User List/i));
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });
  test('renders user info and deletes user on confirm', () => {
    useParams.mockReturnValue({ id: '1' });
    window.confirm = jest.fn(() => true); // although no confirm in component, ensure no error
    render(<DeleteUser />);
    expect(screen.getByText('Alice')).toBeInTheDocument(); // Check user name instead
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Yes, Delete User/i));
    expect(deleteUserMock).toHaveBeenCalledWith('1');
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });

  test('cancel button navigates back', () => {
    useParams.mockReturnValue({ id: '1' });
    render(<DeleteUser />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });
});
