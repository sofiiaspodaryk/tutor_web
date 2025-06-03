import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Lab1DataProvider } from './context/Lab1DataContext';
import './styles/index.css';
import './styles/enhanced.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Lab1DataProvider>
                    <App />
                </Lab1DataProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
