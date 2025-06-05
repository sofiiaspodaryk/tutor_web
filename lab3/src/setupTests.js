// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'util';

// Increase the default timeout for async tests
jest.setTimeout(10000);

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Polyfills needed for JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock window.confirm
window.confirm = jest.fn(() => true);

// Suppress console warnings during tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  // Suppress specific React Router warnings
  if (
    args.length > 0 && 
    typeof args[0] === 'string' && 
    (args[0].includes('React Router') || 
     args[0].includes('Warning: useLayoutEffect') || 
     args[0].includes('ReactDOM.render'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

console.error = (...args) => {
  // Suppress specific React testing errors
  if (
    args.length > 0 && 
    typeof args[0] === 'string' && 
    (args[0].includes('act(...)') || 
     args[0].includes('ReactDOM.render') ||
     args[0].includes('ReactDOMTestUtils.act'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
