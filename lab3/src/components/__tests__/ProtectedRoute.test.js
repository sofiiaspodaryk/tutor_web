import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Helper component that we'll render inside ProtectedRoute
const ProtectedComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should render loading state when isLoading is true', () => {
        // Mock the authentication state - loading
        useAuth.mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <ProtectedComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        // Check if loading indicator is shown
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        
        // Protected content should not be rendered
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render children when user is authenticated', () => {
        // Mock the authentication state - authenticated
        useAuth.mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <ProtectedComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        // Check if protected content is rendered
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
        // Mock the authentication state - not authenticated
        useAuth.mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        });

        // We need to mock Navigate since we can't easily test redirects in JSDOM
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            Navigate: jest.fn(() => null),
        }));

        const { Navigate } = require('react-router-dom');
        Navigate.mockImplementation(({ to }) => <div data-testid="navigated" data-to={to} />);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <ProtectedComponent />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Protected content should not be rendered
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        
        // We can't directly test navigation in JSDOM, but we can verify the redirect
        // is attempted by checking that Navigate was called with appropriate props
        expect(Navigate).toHaveBeenCalledWith(expect.objectContaining({
            to: '/login',
            replace: true
        }), {});
    });
});
