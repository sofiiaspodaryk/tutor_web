import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/mockData';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mock the AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock the ROLES from mockData
jest.mock('../../services/mockData', () => ({
    ROLES: {
        ADMIN: 'admin',
        MANAGER: 'manager',
        STUDENT: 'student',
        TUTOR: 'tutor',
        USER: 'user',
    },
}));

describe('Register Component', () => {
    const mockRegister = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        // Setup the mock implementations
        useAuth.mockReturnValue({ register: mockRegister });
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
        
        // Clear mocks between tests
        jest.clearAllMocks();
    });

    it('should render the registration form', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Check if the form elements are rendered
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Role:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
        
        // Check if the login link is rendered
        expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
    });

    it('should update state when input fields change', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Get the input fields
        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
        const emailInput = screen.getByLabelText('Email:');
        const roleSelect = screen.getByLabelText('Role:');

        // Change the input values
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(roleSelect, { target: { value: ROLES.STUDENT } });

        // Check if input values are updated
        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
        expect(confirmPasswordInput.value).toBe('password123');
        expect(emailInput.value).toBe('test@example.com');
        expect(roleSelect.value).toBe(ROLES.STUDENT);
    });

    it('should validate passwords match before submitting', async () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Get the input fields and submit button
        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
        const emailInput = screen.getByLabelText('Email:');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        // Fill in the registration form with mismatched passwords
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        // Submit the form
        fireEvent.click(submitButton);

        // Check for error message
        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });

        // Register function should not have been called
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate email format before submitting', async () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Get the input fields and submit button
        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
        const emailInput = screen.getByLabelText('Email:');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        // Fill in the registration form with invalid email
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        // Submit the form
        fireEvent.click(submitButton);

        // Check for error message
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });

        // Register function should not have been called
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should call register with correct data and navigate on successful registration', async () => {
        // Setup register mock to resolve successfully
        mockRegister.mockResolvedValueOnce();

        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Get the input fields and submit button
        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
        const emailInput = screen.getByLabelText('Email:');
        const roleSelect = screen.getByLabelText('Role:');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        // Fill in the registration form
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(roleSelect, { target: { value: ROLES.STUDENT } });

        // Submit the form
        fireEvent.click(submitButton);

        // Check if register was called with the correct data
        expect(mockRegister).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'password123',
            email: 'test@example.com',
            role: ROLES.STUDENT,
            confirmPassword: 'password123',
        });

        // Wait for navigation to happen
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('should display an error message on registration failure', async () => {
        // Setup register mock to reject with an error
        mockRegister.mockRejectedValueOnce(new Error('Username already exists'));

        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Get the input fields and submit button
        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
        const emailInput = screen.getByLabelText('Email:');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        // Fill in the registration form
        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        // Submit the form
        fireEvent.click(submitButton);

        // Wait for the error message to appear
        await waitFor(() => {
            expect(screen.getByText('Username already exists')).toBeInTheDocument();
        });

        // Navigation should not have been called
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should disable the register button while loading', async () => {
        // Setup register mock with a delay to test loading state
        mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        // Fill in the required fields
        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });

        // Get the submit button
        const submitButton = screen.getByRole('button', { name: 'Register' });

        // Submit the form to trigger loading state
        fireEvent.click(submitButton);

        // Button should be disabled while loading
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Registering...')).toBeInTheDocument();
    });
});
