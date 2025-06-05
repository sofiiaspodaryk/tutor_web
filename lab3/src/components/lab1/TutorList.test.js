import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Lab1DataProvider } from '../../context/Lab1DataContext';
import TutorList from './TutorList';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <Lab1DataProvider>
        {component}
      </Lab1DataProvider>
    </BrowserRouter>
  );
};

describe('TutorList component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders tutors table with headers', () => {
    renderWithProviders(<TutorList />);
    
    expect(screen.getByText('Tutors')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders tutor data', () => {
    renderWithProviders(<TutorList />);
    
    expect(screen.getByText('Dr. Emily Clark')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('Prof. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Physics')).toBeInTheDocument();
  });

  it('navigates to tutor detail when view button is clicked', () => {
    renderWithProviders(<TutorList />);
    
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith('/tutor-detail/1');
  });
});
