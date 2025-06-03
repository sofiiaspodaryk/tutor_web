import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Users from './components/Users';
import ProtectedRoute from './components/ProtectedRoute';

// Import Lab1 components
import Dashboard from './components/lab1/HomeLab1';
import UserList from './components/lab1/UserList';
import CreateUser from './components/lab1/CreateUser';
import EditUser from './components/lab1/EditUser';
import DeleteUser from './components/lab1/DeleteUser';
import Payment from './components/lab1/Payment';
import StudentSchedule from './components/lab1/StudentSchedule';
import TutorSchedule from './components/lab1/TutorSchedule';
import Tests from './components/lab1/Tests';
import TestStatistic from './components/lab1/TestStatistic';
import TutorList from './components/lab1/TutorList';
import TutorDetail from './components/lab1/TutorDetail';

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
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="user-list" element={<UserList />} />
                    <Route path="create-user" element={<CreateUser />} />
                    <Route path="edit-user/:id" element={<EditUser />} />
                    <Route path="delete-user/:id" element={<DeleteUser />} />
                    <Route path="payment" element={<Payment />} />
                    <Route path="student-schedule" element={<StudentSchedule />} />
                    <Route path="tutor-schedule" element={<TutorSchedule />} />
                    <Route path="tests" element={<Tests />} />
                    <Route path="test-statistic" element={<TestStatistic />} />
                    <Route path="tutor-list" element={<TutorList />} />
                    <Route path="tutor-detail/:id" element={<TutorDetail />} />
                </Route>
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </div>
    );
}

export default App;
