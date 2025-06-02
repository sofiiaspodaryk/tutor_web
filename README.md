# Web2 SPA - User Management System

A single page application built with React for Web Development Lab 3, featuring user authentication, role-based access control, and complete user management functionality.

## Features

- **Authentication System**
  - User login/logout
  - User registration
  - Session persistence with localStorage
  - Protected routes

- **User Management**
  - View all users
  - Create new users (Admin only)
  - Edit existing users (Admin only)
  - Delete users (Admin only)
  - Role-based permissions

- **User Roles**
  - **Admin**: Full access to all features including user management
  - **Manager**: Standard access with potential for extended permissions
  - **User**: Basic access to the system

- **Modern UI/UX**
  - Responsive design
  - Beautiful gradient backgrounds
  - Glass morphism effects
  - Smooth animations and transitions
  - Mobile-friendly interface

## Technology Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.3.0
- **Styling**: Custom CSS with modern design patterns
- **State Management**: React Context API
- **Data**: Mock data with simulated API calls
- **Build Tool**: Create React App
- **Linting**: ESLint with Airbnb configuration

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web2
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
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

## Demo Accounts

The application comes with pre-configured demo accounts for testing:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin` | Admin | Full system access including user management |
| `user1` | `password1` | User | Standard user access |
| `manager1` | `manager123` | Manager | Manager level access |
| `john_doe` | `johndoe123` | User | Standard user access |
| `jane_smith` | `janesmith456` | User | Standard user access |

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Automatically fixes linting issues

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Navigation header
│   ├── Home.js          # Home page component
│   ├── Layout.js        # Main layout wrapper
│   ├── Login.js         # Login form component
│   ├── ProtectedRoute.js # Route protection component
│   ├── Register.js      # Registration form component
│   └── Users.js         # User management component
├── context/             # React context providers
│   └── AuthContext.js   # Authentication context
├── services/            # Data and API services
│   └── mockData.js      # Mock data and API simulation
├── styles/              # CSS stylesheets
│   └── index.css        # Main stylesheet
├── App.js               # Main application component
└── index.js             # Application entry point
```

## Application Routes

- `/login` - User login page
- `/register` - User registration page  
- `/home` - Dashboard/home page (protected)
- `/users` - User management page (protected)

## Development Guidelines

### Code Style

- Uses Airbnb ESLint configuration
- 4 spaces indentation
- Maximum 400 characters per line
- Maximum 75 lines per function
- Single responsibility principle applied to all components

### Component Guidelines

- Each component in its own file
- Consistent naming convention
- Presentation logic kept in component classes
- No arithmetic operations in templates
- Proper error handling and loading states

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Loading speed: < 4 seconds
- Optimized bundle size
- Lazy loading where appropriate
- Efficient state management

## Security Features

- Client-side route protection
- Role-based access control
- Input validation
- XSS protection through React's built-in safeguards

## Future Enhancements

- Real backend API integration
- Email verification for registration
- Password reset functionality
- Advanced user search and filtering
- User profile editing
- Admin dashboard with analytics
- Real-time notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of a university lab assignment and is for educational purposes only.

## Contact

For questions or support, please contact the development team.
