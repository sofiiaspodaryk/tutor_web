import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Users from './components/Users';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/home" replace /> : <Login />
                    }
                />
                <Route
                    path="/register"
                    element={
                        isAuthenticated ? <Navigate to="/home" replace /> : <Register />
                    }
                />
                <Route
                    path="/"
                    element={(
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    )}
                >
                    <Route index element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<Home />} />
                    <Route path="users" element={<Users />} />
                </Route>
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </div>
    );
}

export default App;
