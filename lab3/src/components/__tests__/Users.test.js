import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Users from '../Users';
import { AuthProvider } from '../../context/AuthContext';
import * as mockDataService from '../../services/mockData';

// Mock the AuthContext values
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        currentUser: { id: 0, username: 'admin', role: 'admin' },
        isAdmin: () => true,
    }),
    AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock the mockData service functions
jest.mock('../../services/mockData', () => ({
    fetchUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    ROLES: {
        ADMIN: 'admin',
        MANAGER: 'manager',
        STUDENT: 'student',
        TUTOR: 'tutor',
    }
}));

describe('Users Component', () => {
    // Sample user data for tests
    const mockUsers = [
        {
            id: 0,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 1,
            username: 'manager1',
            email: 'manager@example.com',
            role: 'manager',
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ];

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        
        // Mock the fetchUsers implementation
        mockDataService.fetchUsers.mockResolvedValue(mockUsers);
        
        // Mock window.confirm
        window.confirm = jest.fn().mockImplementation(() => true);
    });

    it('should render the users list', async () => {
        render(<Users />);
        
        // Initially it should show loading
        expect(screen.getByText('Loading users...')).toBeInTheDocument();
        
        // After data loads, it should show the users
        await waitFor(() => {
            expect(screen.getByText('admin')).toBeInTheDocument();
            expect(screen.getByText('manager1')).toBeInTheDocument();
        });
        
        // Check if the table headers are rendered
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
        
        // Verify the create button is present
        expect(screen.getByText('Create User')).toBeInTheDocument();
    });

    it('should open the create user form when create button is clicked', async () => {
        render(<Users />);
        
        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('Create User')).toBeInTheDocument();
        });
        
        // Click on the create user button
        fireEvent.click(screen.getByText('Create User'));
        
        // Check if form is displayed
        expect(screen.getByText('Create New User')).toBeInTheDocument();
        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Role:')).toBeInTheDocument();
    });

    it('should handle user creation', async () => {
        // Mock createUser to return a successful response
        mockDataService.createUser.mockResolvedValue({
            id: 3,
            username: 'newuser',
            email: 'newuser@example.com',
            role: 'student'
        });

        render(<Users />);
        
        // Wait for data to load and click create user
        await waitFor(() => {
            fireEvent.click(screen.getByText('Create User'));
        });
        
        // Fill in the form
        fireEvent.change(screen.getByLabelText('Username:'), {
            target: { value: 'newuser' }
        });
        fireEvent.change(screen.getByLabelText('Email:'), {
            target: { value: 'newuser@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Role:'), {
            target: { value: 'student' }
        });
        
        // Submit the form
        fireEvent.click(screen.getByText('Save'));
        
        // Verify createUser was called with correct data
        await waitFor(() => {
            expect(mockDataService.createUser).toHaveBeenCalledWith({
                username: 'newuser',
                email: 'newuser@example.com',
                role: 'student',
                password: 'defaultpass123'
            });
            expect(mockDataService.fetchUsers).toHaveBeenCalledTimes(2); // Initial + after create
        });
    });

    it('should handle user edit', async () => {
        // Mock updateUser to return a successful response
        mockDataService.updateUser.mockResolvedValue({
            id: 1,
            username: 'updateduser',
            email: 'updated@example.com',
            role: 'manager'
        });

        render(<Users />);
        
        // Wait for data to load
        await waitFor(() => {
            expect(screen.getAllByText('Edit')[1]).toBeInTheDocument();
        });
        
        // Click edit button on the second user (manager1)
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[1]); // Second edit button
        
        // Verify edit form is shown with pre-filled data
        expect(screen.getByText('Edit User')).toBeInTheDocument();
        
        // Change the username
        fireEvent.change(screen.getByLabelText('Username:'), {
            target: { value: 'updateduser' }
        });
        
        // Submit the form
        fireEvent.click(screen.getByText('Save'));
        
        // Verify updateUser was called with correct data
        await waitFor(() => {
            expect(mockDataService.updateUser).toHaveBeenCalledWith(1, {
                username: 'updateduser',
                email: 'manager@example.com', // This should be unchanged from the initial value
                role: 'manager' // This should be unchanged from the initial value
            });
            expect(mockDataService.fetchUsers).toHaveBeenCalledTimes(2); // Initial + after update
        });
    });

    it('should handle user deletion', async () => {
        // Mock deleteUser to return a successful response
        mockDataService.deleteUser.mockResolvedValue(true);

        render(<Users />);
        
        // Wait for data to load
        await waitFor(() => {
            expect(screen.getAllByText('Delete')[1]).toBeInTheDocument();
        });
        
        // Click delete button on the second user (manager1)
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[1]); // Second delete button
        
        // Verify deleteUser was called with correct user id
        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalled();
            expect(mockDataService.deleteUser).toHaveBeenCalledWith(1);
            expect(mockDataService.fetchUsers).toHaveBeenCalledTimes(2); // Initial + after delete
        });
    });

    it('should handle cancel when editing', async () => {
        render(<Users />);
        
        // Wait for data to load
        await waitFor(() => {
            expect(screen.getAllByText('Edit')[0]).toBeInTheDocument();
        });
        
        // Click edit button on the first user
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
        
        // Form should be visible
        expect(screen.getByText('Edit User')).toBeInTheDocument();
        
        // Click cancel
        fireEvent.click(screen.getByText('Cancel'));
        
        // Form should be closed, create button visible again
        expect(screen.queryByText('Edit User')).not.toBeInTheDocument();
        expect(screen.getByText('Create User')).toBeInTheDocument();
    });

    it('should handle error when loading users', async () => {
        // Mock fetchUsers to throw an error
        mockDataService.fetchUsers.mockRejectedValue(new Error('Failed to fetch'));
        
        render(<Users />);
        
        // Check if error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Failed to load users')).toBeInTheDocument();
        });
    });

    it('should display error when trying to delete own account', async () => {
        render(<Users />);
        
        // Wait for data to load
        await waitFor(() => {
            expect(screen.getAllByText('Delete')[0]).toBeInTheDocument();
        });
        
        // Try to delete the first user (admin, which is the current user)
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
        
        // Verify error message is shown
        expect(screen.getByText('You cannot delete your own account')).toBeInTheDocument();
        
        // deleteUser should not have been called
        expect(mockDataService.deleteUser).not.toHaveBeenCalled();
    });
});
