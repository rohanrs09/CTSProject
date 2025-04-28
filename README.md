# Smart Hotel Booking System - Frontend

This is the frontend part of the Smart Hotel Booking System, a comprehensive application for booking hotels, managing rooms, and handling user accounts.

## Features

- User registration and authentication with JWT
- Role-based access control (Admin, Hotel Manager, Guest)
- Hotel search and filtering
- Room availability checking
- Secure booking process
- Reviews and ratings
- Loyalty points program

## Technology Stack

- React 18
- TypeScript
- React Router for navigation
- Bootstrap for UI components
- Axios for API communication

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page components
- `src/context/`: Context providers for state management
- `src/services/`: API services
- `src/models/`: TypeScript interfaces

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Backend Integration

This frontend application is designed to work with the ASP.NET Core backend. Make sure the backend API is running at the correct URL (configured in the proxy setting in package.json).

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production to the `build` folder

## License

This project is licensed under the terms of the MIT license. 