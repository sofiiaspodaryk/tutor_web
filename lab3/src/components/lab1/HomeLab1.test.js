import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeLab1 from './HomeLab1';
import { useLab1Data } from '../../context/Lab1DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

jest.mock('../../context/Lab1DataContext');
jest.mock('../../context/AuthContext');
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));

describe('HomeLab1 component', () => {
  const navigateMock = jest.fn();
  const sampleData = {
    users: [{ id: '1' }],
    tutors: [{ id: 't1' }, { id: 't2' }],
    payments: [{ id: 'p1' }],
    schedules: [{ id: 's1' }, { id: 's2' }, { id: 's3' }],
    tests: [{ id: 'tst1' }, { id: 'tst2' }],
  };

  beforeEach(() => {
    useLab1Data.mockReturnValue(sampleData);
    useAuth.mockReturnValue({ user: { username: 'TestUser' } });
    useNavigate.mockReturnValue(navigateMock);
    render(<HomeLab1 />);
  });

  afterEach(() => jest.clearAllMocks());

  test('renders welcome message with username', () => {
    expect(screen.getByText(/Welcome back, TestUser/i)).toBeInTheDocument();
  });

  test('renders dashboard stats and handles click', () => {
    const userCard = screen.getByText('Total Users').closest('div');
    fireEvent.click(userCard);
    expect(navigateMock).toHaveBeenCalledWith('/user-list');
  });

  test('renders quick actions and clickable buttons', () => {
    const btn = screen.getByText('Create User');
    fireEvent.click(btn);
    expect(navigateMock).toHaveBeenCalledWith('/create-user');
  });

  test('renders recent activities', () => {
    expect(screen.getByText('New user registered')).toBeInTheDocument();
  });

  test('renders system overview section', () => {
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
  });
});
