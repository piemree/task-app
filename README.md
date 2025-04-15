# Advanced Task Management and Workflow Application

[![Deploy API to GHCR](https://github.com/piemree/task-app/actions/workflows/deploy-api.yml/badge.svg)](https://github.com/piemree/task-app/actions/workflows/deploy-api.yml)
[![codecov](https://codecov.io/gh/piemree/task-app/graph/badge.svg?token=D0OLTPLQ8B)](https://codecov.io/gh/piemree/task-app)

This project is a comprehensive workflow application for managing projects and tasks.

## Live Environment

You can access the live version of the application through these links:

- **Frontend**: [https://taskapp.emredemir.tech](https://taskapp.emredemir.tech)
- **API**: [https://taskapi.emredemir.tech](https://taskapi.emredemir.tech)
- **API Documentation**: [https://taskapi.emredemir.tech/docs](https://taskapi.emredemir.tech/docs)

## Project Structure

This project is configured as a monorepo using PNPM Workspace. It contains two main apps:

- `apps/web`: Frontend application built with Next.js 15 (App Router)
- `apps/api`: REST API built with Express.js, TypeScript, and MongoDB

The overall project structure is as follows:

```
/
├── apps/
│   ├── api/                 # Backend API
│   │   ├── src/             # Source code
│   │   │   ├── controllers/ # API endpoint handlers
│   │   │   ├── middlewares/ # Express middlewares
│   │   │   ├── models/      # Mongoose database models
│   │   │   ├── routes/      # API endpoint routes
│   │   │   ├── services/    # Business logic services
│   │   │   ├── schemas/     # Zod validation schemas
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   ├── config/      # Application configuration
│   │   │   ├── utils/       # Helper functions
│   │   │   ├── error/       # Error management tools
│   │   │   ├── handlers/    # Global handlers
│   │   │   ├── openapi/     # API documentation configuration
│   │   │   ├── app.ts       # Express application
│   │   │   └── server.ts    # HTTP server
│   │   ├── public/          # Public assets
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── package.json     # Package dependencies
│   │
│   └── web/                 # Frontend application
│       ├── app/             # Next.js App Router pages
│       │   ├── auth/        # Authentication pages
│       │   ├── dashboard/   # Dashboard and project pages
│       │   └── invite/      # Invite pages
│       ├── components/      # React components
│       │   ├── auth/        # Authentication components
│       │   ├── dashboard/   # Dashboard components
│       │   ├── projects/    # Project-related components
│       │   ├── tasks/       # Task-related components
│       │   ├── profile/     # User profile components
│       │   ├── ui/          # UI components (shadcn/ui)
│       │   └── invite/      # Invite-related components
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utility functions and libraries
│       │   └── redux/       # Redux store and slices
│       ├── services/        # API services
│       ├── styles/          # Style files
│       ├── public/          # Static assets
│       └── package.json     # Package dependencies
│
├── node_modules/            # Root dependencies
├── package.json             # Root package configuration
├── pnpm-workspace.yaml      # PNPM workspace configuration
├── pnpm-lock.yaml           # PNPM lock file
└── biome.json               # Biome configuration
```

## Technologies

### Web

- **Frontend Framework**: Next.js 15 (App Router)
- **State Management**: Redux Toolkit
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: JWT-based authentication
- **Socket.io Client**: Real-time communication

### API (Backend)

- **Express.js**: Node.js based web framework
- **TypeScript**: Provides static type safety
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM (Object Document Mapper)
- **JWT**: JSON Web Token based authentication
- **Bcrypt**: Password encryption
- **Socket.io**: Real-time communication
- **Zod-OpenAPI**: API schema validation and documentation
- **Swagger UI**: API documentation visualization
- **Nodemailer**: Email sending functionality
- **Vitest**: Testing framework

## Features

- **User Management**: Registration, login, and JWT-based authentication
- **Role-Based Authorization**: Permission controls between Admin, Manager, Developer roles
- **Project Management**: Creation and management of projects
- **Task Management**: Creation, assignment, and status tracking of tasks
- **Task Status Logs**: Monitoring status changes of tasks
- **Notification System**: Real-time notifications (integrated with Socket.io)
- **Email Notifications**: Automatic email notifications for important events
- **User Interface**: Clean and intuitive interface for managing projects and tasks
- **Responsive Design**: Works on desktop and mobile devices
- **Invitation System**: Inviting users to projects

## Development

### Installation

```bash
# Clone the project
git clone https://github.com/piemree/task-app
cd task-app

# Install dependencies
pnpm install
```

### Environment Variables for API

Create a `.env` file in the API directory and set the following variables:

```
DATABASE_URL="mongodb://localhost:27017/task-app"
PORT=5000
JWT_AUTH_SECRET="jwt_auth_secret_key"
JWT_AUTH_EXPIRES_IN=1d
JWT_INVITE_SECRET="jwt_invite_secret_key"
JWT_INVITE_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000
NODE_ENV=development
MAIL_HOST="mail_host"
MAIL_PORT="mail_port"
MAIL_USER="mail_user"
MAIL_PASS="mail_pass"
```

### Starting the Development Environment

```bash
# Run the API
pnpm --filter @task-app/api dev

# Run the Frontend
pnpm --filter @task-app/web dev
```

### Frontend Architecture

The frontend application follows a clean architecture pattern with the following layers:

1. **Presentation Layer**: React components and pages
2. **State Management Layer**: Redux store, slices, and actions
3. **Service Layer**: API services for data fetching and manipulation
4. **Model Layer**: TypeScript interfaces and types

#### Redux Architecture

The application uses Redux Toolkit for state management. The Redux structure is organized as follows:

```
lib/redux/
├── store.ts             # Redux store configuration
├── hooks.ts             # Custom Redux hooks (useAppDispatch, useAppSelector)
└── slices/              # Redux slices
    └── authSlice.ts     # Authentication state management
```

Currently, the application implements the **authSlice** for managing user authentication state, which includes:
- User information
- JWT token management
- Loading states
- Error handling

The authSlice supports the following operations:
- User login and token storage
- User logout and token removal
- Profile information retrieval
- User information updates

Each slice follows the Redux Toolkit pattern with:
- TypeScript interfaces for type safety
- Initial state configuration
- Reducers for synchronous state updates
- AsyncThunks for handling asynchronous API calls
- ExtraReducers for handling async operation states (pending, fulfilled, rejected)

Redux state is made available throughout the application using the Redux Provider component.

#### Authentication Flow

The application uses a token-based authentication system:

1. User logs in with email and password
2. Server validates credentials and returns a JWT token
3. Token is stored in localStorage and cookies
4. Token is used for subsequent API requests
5. On application load, the token is checked and user profile is fetched if token exists
6. On logout, token is removed from localStorage and cookies

### API Documentation

When the API is running, API documentation created with Swagger UI can be accessed at the following URL:

```
http://localhost:5000/docs
```

### API Testing

The API application can be tested with Vitest:

```bash
# Run tests
pnpm --filter @task-app/api test

# Run tests with coverage report
pnpm --filter @task-app/api test:coverage
```

## License

MIT

