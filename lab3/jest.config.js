module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/index.js',
        '!src/App.js',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    testEnvironment: 'jsdom',
    testMatch: [
        "**/__tests__/**/*.js",
        "**/?(*.)+(spec|test).js"
    ],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js"
    }
};
