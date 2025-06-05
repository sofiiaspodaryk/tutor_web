import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Lab1DataProvider } from '../../context/Lab1DataContext';
import TutorDetail from './TutorDetail';

const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
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

describe('TutorDetail component', () => {
  beforeEach(() => {
    mockUseParams.mockClear();
  });

  it('renders tutor details when tutor exists', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    renderWithProviders(<TutorDetail />);
    
    expect(screen.getByText('Dr. Emily Clark')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('Schedules')).toBeInTheDocument();
  });

  it('renders "Tutor not found" when tutor does not exist', () => {
    mockUseParams.mockReturnValue({ id: 'nonexistent' });
    renderWithProviders(<TutorDetail />);
    
    expect(screen.getByText('Tutor not found')).toBeInTheDocument();
  });

  it('renders tutor schedules table', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    renderWithProviders(<TutorDetail />);
    
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Topic')).toBeInTheDocument();
    expect(screen.getByText('Algebra')).toBeInTheDocument();
  });
});
