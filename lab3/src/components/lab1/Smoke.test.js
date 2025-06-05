import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Lab1DataProvider } from '../../context/Lab1DataContext';
import { AuthProvider } from '../../context/AuthContext';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import HomeLab1 from './HomeLab1';
import Payment from './Payment';
import StudentSchedule from './StudentSchedule';
import Tests from './Tests';
import UserList from './UserList';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Lab1DataProvider>
          {component}
        </Lab1DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('lab1 component smoke tests', () => {
  it('renders CreateUser without crashing', () => {
    renderWithProviders(<CreateUser />);
  });
  it('renders EditUser without crashing', () => {
    renderWithProviders(<EditUser />);
  });
  it('renders DeleteUser without crashing', () => {
    renderWithProviders(<DeleteUser />);
  });
  it('renders HomeLab1 without crashing', () => {
    renderWithProviders(<HomeLab1 />);
  });
  it('renders Payment without crashing', () => {
    renderWithProviders(<Payment />);
  });
  it('renders StudentSchedule without crashing', () => {
    renderWithProviders(<StudentSchedule />);
  });
  it('renders Tests without crashing', () => {
    renderWithProviders(<Tests />);
  });
  it('renders UserList without crashing', () => {
    renderWithProviders(<UserList />);
  });
});
