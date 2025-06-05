import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateUser from './CreateUser';
import { useLab1Data } from '../../context/Lab1DataContext';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../../context/Lab1DataContext');

describe('CreateUser component', () => {
  const addUserMock = jest.fn();
  const navigateMock = jest.fn();

  beforeEach(() => {
    useLab1Data.mockReturnValue({ addUser: addUserMock });
    useNavigate.mockReturnValue(navigateMock);
    render(<CreateUser />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields and buttons', () => {
    expect(screen.getByPlaceholderText(/Enter full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/Create User/i)).toBeInTheDocument();
  });

  test('cancel button navigates back', () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });
  test('submit form calls addUser and navigates', () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'tutor' } });
    fireEvent.click(screen.getByText(/Create User/i));

    expect(addUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe', email: 'john@example.com', role: 'tutor' })
    );
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });
});
