import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../Home';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('Home Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should render correctly with a logged in user', () => {
        // Setup mock user
        useAuth.mockReturnValue({
            currentUser: { username: 'testuser', role: 'student' },
        });

        render(<Home />);

        // Check if user-specific content is rendered
        expect(screen.getByText(/Welcome, testuser/)).toBeInTheDocument();
    });

    it('should render the application features section', () => {
        // Setup mock user
        useAuth.mockReturnValue({
            currentUser: { username: 'testuser', role: 'student' },
        });

        render(<Home />);

        // Check if features section is rendered (using the actual text in the component)
        expect(screen.getByText('Application Features')).toBeInTheDocument();
        expect(screen.getByText('✓ User Authentication (Login/Logout)')).toBeInTheDocument();
    });
    
    it('should render the technology stack section', () => {
        // Setup mock user
        useAuth.mockReturnValue({
            currentUser: { username: 'testuser', role: 'student' },
        });

        render(<Home />);

        // Check if tech stack section is rendered
        expect(screen.getByText('Technology Stack')).toBeInTheDocument();
        expect(screen.getByText('React 18')).toBeInTheDocument();
    });
});
