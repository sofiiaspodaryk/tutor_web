/* eslint-disable max-lines-per-function, react/jsx-no-constructed-context-values */
import React, {
    createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import { mockUsers, ROLES } from '../services/mockData';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('currentUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials) => {
        const { username, password } = credentials;

        // Simulate API call delay
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        // Find user in mock data
        const user = mockUsers.find(
            (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
        );

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const userSession = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt,
        };

        setCurrentUser(userSession);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        return userSession;
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
    };

    const register = async (userData) => {
        const {
            username, password, email, role = ROLES.USER,
        } = userData;

        // Simulate API call delay
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        // Check if username already exists
        const existingUser = mockUsers.find(
            (u) => u.username.toLowerCase() === username.toLowerCase(),
        );

        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username,
            password,
            email: email || `${username}@example.com`,
            role,
            createdAt: new Date().toISOString(),
        };

        // Add to mock data (in real app, this would be sent to backend)
        mockUsers.push(newUser);

        return newUser;
    };

    const hasRole = (role) => {
        if (!currentUser) return false;
        return currentUser.role === role;
    };

    const isAdmin = () => hasRole(ROLES.ADMIN);

    const value = useMemo(() => ({
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        hasRole,
        isAdmin,
    }), [currentUser, isAuthenticated, isLoading, hasRole, isAdmin]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
