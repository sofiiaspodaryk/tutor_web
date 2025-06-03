import React, { createContext, useState, useContext } from 'react';

const Lab1DataContext = createContext();

export const Lab1DataProvider = ({ children }) => {
  // Sample users data
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
    { id: '3', name: 'Carol Lee', email: 'carol@example.com' }
  ]);

  // Sample tutors data
  const [tutors, setTutors] = useState([
    { id: '1', name: 'Dr. Emily Clark', subject: 'Math' },
    { id: '2', name: 'Prof. John Doe', subject: 'Physics' }
  ]);

  // Sample payments
  const [payments, setPayments] = useState([
    { id: '1', userId: '1', amount: 200, date: '2025-05-01' },
    { id: '2', userId: '2', amount: 150, date: '2025-05-03' }
  ]);

  // Sample schedules
  const [schedules, setSchedules] = useState([
    { id: '1', userId: '1', date: '2025-06-10', topic: 'Algebra' },
    { id: '2', userId: '2', date: '2025-06-12', topic: 'Mechanics' }
  ]);

  // Sample tests
  const [tests, setTests] = useState([
    { id: '1', userId: '1', score: 95, date: '2025-05-20' },
    { id: '2', userId: '2', score: 88, date: '2025-05-22' }
  ]);

  // User CRUD
  const addUser = (user) => setUsers((prev) => [...prev, { ...user, id: Date.now().toString() }]);
  const updateUser = (updated) => setUsers((prev) => prev.map(u => u.id === updated.id ? updated : u));
  const deleteUser = (id) => setUsers((prev) => prev.filter(u => u.id !== id));

  // Payment CRUD
  const addPayment = (payment) => setPayments((prev) => [...prev, { ...payment, id: Date.now().toString() }]);
  const updatePayment = (updated) => setPayments((prev) => prev.map(p => p.id === updated.id ? updated : p));
  const deletePayment = (id) => setPayments((prev) => prev.filter(p => p.id !== id));

  // Schedule CRUD
  const addSchedule = (schedule) => setSchedules((prev) => [...prev, { ...schedule, id: Date.now().toString() }]);
  const updateSchedule = (updated) => setSchedules((prev) => prev.map(s => s.id === updated.id ? updated : s));
  const deleteSchedule = (id) => setSchedules((prev) => prev.filter(s => s.id !== id));

  // Test CRUD
  const addTest = (test) => setTests((prev) => [...prev, { ...test, id: Date.now().toString() }]);
  const updateTest = (updated) => setTests((prev) => prev.map(t => t.id === updated.id ? updated : t));
  const deleteTest = (id) => setTests((prev) => prev.filter(t => t.id !== id));

  return (
    <Lab1DataContext.Provider
      value={{
        users, addUser, updateUser, deleteUser,
        tutors,
        payments, addPayment, updatePayment, deletePayment,
        schedules, addSchedule, updateSchedule, deleteSchedule,
        tests, addTest, updateTest, deleteTest
      }}
    >
      {children}
    </Lab1DataContext.Provider>
  );
};

export const useLab1Data = () => {
  const context = useContext(Lab1DataContext);
  if (!context) throw new Error('useLab1Data must be used within Lab1DataProvider');
  return context;
};