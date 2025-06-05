import React from 'react';
import { render, screen } from '@testing-library/react';
import { Lab1DataProvider } from '../../context/Lab1DataContext';
import TestStatistic from './TestStatistic';

const renderWithProvider = (component) => {
  return render(
    <Lab1DataProvider>
      {component}
    </Lab1DataProvider>
  );
};

describe('TestStatistic component', () => {
  it('renders test statistics heading', () => {
    renderWithProvider(<TestStatistic />);
    
    expect(screen.getByText('Test Statistics')).toBeInTheDocument();
  });

  it('displays total tests count', () => {
    renderWithProvider(<TestStatistic />);
    
    expect(screen.getByText('Total Tests:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // From sample data
  });

  it('displays average score', () => {
    renderWithProvider(<TestStatistic />);
    
    expect(screen.getByText('Average Score:')).toBeInTheDocument();
    // Average of 95 and 88 = 91.5
    expect(screen.getByText('91.50')).toBeInTheDocument();
  });

  it('displays highest and lowest scores', () => {
    renderWithProvider(<TestStatistic />);
    
    expect(screen.getByText('Highest Score:')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    
    expect(screen.getByText('Lowest Score:')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('renders per user statistics table', () => {
    renderWithProvider(<TestStatistic />);
    
    expect(screen.getByText('Per User Statistics')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Tests Taken')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
  });

  it('displays user statistics', () => {
    renderWithProvider(<TestStatistic />);
    
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Carol Lee')).toBeInTheDocument();
  });
});
