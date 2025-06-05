import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../services/mockData';

// Mock localStorage for testing
jest.spyOn(Storage.prototype, 'setItem');
jest.spyOn(Storage.prototype, 'getItem');
jest.spyOn(Storage.prototype, 'removeItem');

// Create a test component that uses the Auth context
const TestComponent = () => {
    const {
        currentUser,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        logout,
        register,
    } = useAuth();

    return (
        <div>
            <p data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</p>
            <p data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
            <p data-testid="isAdmin">{isAdmin ? 'Admin' : 'Not Admin'}</p>
            <p data-testid="username">{currentUser ? currentUser.username : 'No User'}</p>
            <button 
                data-testid="login-btn" 
                onClick={() => login({ username: 'admin', password: 'admin' })}
            >
                Login
            </button>
            <button
                data-testid="register-btn"
                onClick={() => register({ username: 'newuser', password: 'password123', email: 'new@example.com', role: 'student' })}
            >
                Register
            </button>
            <button data-testid="logout-btn" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

// Test setup - wrap the test component with the AuthProvider
const renderWithAuthProvider = () => {
    return render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );
};

describe('AuthContext', () => {
    // Clean up localStorage after each test
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    // Mock setTimeout/promises
    jest.useFakeTimers();

    it('should initialize with no logged in user', () => {
        renderWithAuthProvider();
        
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
        expect(screen.getByTestId('isAdmin')).toHaveTextContent('Not Admin');
        expect(screen.getByTestId('username')).toHaveTextContent('No User');
    });

    it('should restore user from localStorage on mount', async () => {
        // Setup localStorage with a stored user
        const storedUser = { 
            id: 0,
            username: 'admin', 
            email: 'admin@example.com',
            role: 'admin'
        };
        
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'currentUser') {
                return JSON.stringify(storedUser);
            }
            return null;
        });

        // Render the component
        renderWithAuthProvider();
        
        // Fast-forward through any timers
        act(() => {
            jest.runAllTimers();
        });

        // Verify the user was restored from localStorage
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('isAdmin')).toHaveTextContent('Admin');
        expect(screen.getByTestId('username')).toHaveTextContent('admin');
    });

    it('should login successfully with valid credentials', async () => {
        renderWithAuthProvider();

        // Click the login button (which uses admin/admin credentials)
        await act(async () => {
            fireEvent.click(screen.getByTestId('login-btn'));
            jest.runAllTimers();
        });

        // Check if the user is logged in
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('username')).toHaveTextContent('admin');
        expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', expect.any(String));
    });

    it('should fail login with invalid credentials', async () => {
        const TestComponentWithInvalidLogin = () => {
            const { login, isAuthenticated } = useAuth();
            return (
                <div>
                    <p data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
                    <button 
                        data-testid="invalid-login-btn" 
                        onClick={() => login({ username: 'wrong', password: 'wrong' }).catch(e => {})}
                    >
                        Invalid Login
                    </button>
                </div>
            );
        };

        render(
            <AuthProvider>
                <TestComponentWithInvalidLogin />
            </AuthProvider>
        );

        // Try to login with invalid credentials
        await act(async () => {
            fireEvent.click(screen.getByTestId('invalid-login-btn'));
            jest.runAllTimers();
        });

        // Check that the user is still not authenticated
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    });

    it('should register a new user', async () => {
        const originalLength = mockUsers.length;
        
        renderWithAuthProvider();

        // Click the register button
        await act(async () => {
            fireEvent.click(screen.getByTestId('register-btn'));
            jest.runAllTimers();
        });

        // Check if a new user was added to mockUsers
        expect(mockUsers.length).toBe(originalLength + 1);
        const newUser = mockUsers.find(u => u.username === 'newuser');
        expect(newUser).toBeDefined();
        expect(newUser.email).toBe('new@example.com');
        
        // Clean up the test data
        mockUsers.pop();
    });

    it('should log out correctly', async () => {
        renderWithAuthProvider();

        // First login
        await act(async () => {
            fireEvent.click(screen.getByTestId('login-btn'));
            jest.runAllTimers();
        });

        // Then logout
        await act(async () => {
            fireEvent.click(screen.getByTestId('logout-btn'));
        });

        // Check that the user is logged out
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
        expect(screen.getByTestId('username')).toHaveTextContent('No User');
        expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    });
});
