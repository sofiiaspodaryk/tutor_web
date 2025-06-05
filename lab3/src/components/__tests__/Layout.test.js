import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';

// Mock the Header component
jest.mock('../Header', () => () => <div data-testid="header-mock">Header Mock</div>);

describe('Layout Component', () => {
    it('should render Header component', () => {
        render(
            <BrowserRouter>
                <Layout>
                    <p data-testid="test-child">Test Child</p>
                </Layout>
            </BrowserRouter>
        );
        
        // Check if header mock is rendered
        expect(screen.getByTestId('header-mock')).toBeInTheDocument();
        
        // Check if the child is rendered
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        
        // Check if the layout has main-content class
        const mainContent = screen.getByRole('main');
        expect(mainContent).toHaveClass('main-content');
    });
});
