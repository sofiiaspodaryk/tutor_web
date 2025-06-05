import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../../context/AuthContext';

// Mock react-router-dom's useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mock the AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn().mockImplementation(() => Promise.resolve())
    })
}));

describe('Login Component', () => {
    beforeEach(() => {
        // Clear mocks between tests
        jest.clearAllMocks();
    });

    it('should render the login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Check if the form elements are rendered
        expect(screen.getByRole('heading', { level: 2, name: 'Login' })).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        
        // Check if the register link is rendered
        expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    it('should update state when input fields change', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Get the input fields
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        // Change the input values
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Check if input values are updated
        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });
    
    it('should allow form submission', () => {
        const { container } = render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Get the form
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
        
        // Ensure form can be submitted
        expect(form).toHaveAttribute('onsubmit');
    });
});
