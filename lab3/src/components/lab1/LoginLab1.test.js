import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginLab1 from './LoginLab1';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginLab1 component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders welcome message and description', () => {
    renderWithRouter(<LoginLab1 />);
    expect(screen.getByText('Welcome to Interactive Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage users, tutors, payments, schedules, and test data seamlessly.')).toBeInTheDocument();
  });

  it('renders enter dashboard button', () => {
    renderWithRouter(<LoginLab1 />);
    const enterButton = screen.getByText('Enter Dashboard');
    expect(enterButton).toBeInTheDocument();
  });

  it('navigates to dashboard when button is clicked', () => {
    renderWithRouter(<LoginLab1 />);
    const enterButton = screen.getByText('Enter Dashboard');
    fireEvent.click(enterButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
