# Web2 Lab3 - Single Page Application (SPA)

A modern React-based Single Page Application with user authentication, role-based access control, and user management functionality.

## Features

- ✅ **Authentication**: Login/Logout functionality
- ✅ **User Registration**: New user registration with role selection
- ✅ **Role-based Access Control**: Admin, Manager, and User roles
- ✅ **User Management**: CRUD operations for users (Admin only)
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Modern UI**: Clean and professional interface
- ✅ **Persistent Sessions**: Login state persists across browser sessions
- ✅ **Mock Data**: No backend required - all data stored in memory

## Technology Stack

- **React 18** - Modern React with Hooks and Context API
- **React Router v6** - Client-side routing with protected routes
- **CSS3** - Custom styling with modern design patterns
- **Local Storage** - Session persistence
- **ESLint** - Code quality and AirBnB style guide compliance

## Demo Accounts

Use these accounts to test the application:

- **Admin**: `admin` / `admin`
- **Manager**: `manager1` / `manager123`
- **User**: `user1` / `password1`

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd web2/lab3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   
   The application will automatically open at [http://localhost:8000](http://localhost:8000)

### Alternative Setup

If port 8000 is occupied, you can manually specify the port:

```bash
# Windows (PowerShell)
$env:PORT=8000; npm start

# Windows (Command Prompt)
set PORT=8000 && npm start

# Linux/macOS
PORT=8000 npm start
```

## Available Scripts

- `npm start` - Start development server on port 8000
- `npm run build` - Build production version
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues automatically

## Project Structure

```
lab3/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Header.js       # Navigation header
│   │   ├── Home.js         # Home page
│   │   ├── Layout.js       # Main layout wrapper
│   │   ├── Login.js        # Login form
│   │   ├── ProtectedRoute.js # Route protection
│   │   ├── Register.js     # Registration form
│   │   └── Users.js        # User management
│   ├── context/
│   │   └── AuthContext.js  # Authentication state management
│   ├── services/
│   │   └── mockData.js     # Mock data and API functions
│   ├── styles/
│   │   └── index.css       # Application styles
│   ├── App.js              # Main app component
│   └── index.js            # App entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Features Overview

### Authentication System
- Secure login/logout functionality
- Session persistence using Local Storage
- Protected routes that redirect to login
- Role-based access control

### User Management (Admin Only)
- View all users in a table format
- Create new users with role assignment
- Edit existing user information
- Delete users (except own account)
- Real-time updates without page refresh

### User Roles
- **Admin**: Full access to all features including user management
- **Manager**: Access to main application features
- **User**: Basic access to personal dashboard

### Responsive Design
- Mobile-first design approach
- Adaptive layout for different screen sizes
- Touch-friendly interface elements
- Cross-browser compatibility

## Development Guidelines

### Code Style
- Follows AirBnB JavaScript style guide
- 4-space indentation
- Maximum 400 characters per line
- Maximum 75 lines per function
- Single responsibility principle

### Component Architecture
- Functional components with React Hooks
- Context API for state management
- Reusable component design
- Proper prop validation

### Performance Considerations
- Lazy loading for route components
- Efficient re-rendering with proper dependencies
- Optimized bundle size
- Fast loading times (< 4 seconds)

## Browser Support

Tested and supported on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Use different port
$env:PORT=3000; npm start
```

**Dependencies issues:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Build errors:**
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Test all functionality before committing
4. Ensure no console errors or warnings
5. Update documentation as needed

## License

This project is for educational purposes as part of Web Development coursework.

---

**Course**: Web Development and Web Design  
**Lab**: Lab 3 - Basic Single Page Application with User Management  
**Framework**: React  
**Port**: 8000  
**Max Points**: 10
