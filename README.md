# Advanced Task Management and Workflow Application

This project is a comprehensive workflow application for managing projects and tasks.

## Live Environment

You can access the live version of the application through these links:

- **Frontend**: [https://task-app-frontend-black.vercel.app](https://task-app-frontend-black.vercel.app)
- **API**: [https://task-app-api-j1sb.onrender.com](https://task-app-api-j1sb.onrender.com)
- **API Documentation**: [https://task-app-api-j1sb.onrender.com/docs](https://task-app-api-j1sb.onrender.com/docs)

## Project Structure

This project is configured as a monorepo using PNPM Workspace. It contains two main packages:

- `packages/frontend`: Frontend application built with Next.js 15 (App Router)
- `packages/api`: REST API built with Express.js, TypeScript, and MongoDB

The overall project structure is as follows:

```
/
├── packages/
│   ├── api/                 # Backend API
│   │   ├── src/             # Source code
│   │   ├── public/          # Public assets
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── package.json     # Package dependencies
│   │
│   └── frontend/            # Frontend application
│       ├── app/             # Next.js App Router pages
│       ├── components/      # React components
│       ├── lib/             # Utility functions and libraries
│       ├── services/        # API services
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

### Frontend

- **Frontend Framework**: Next.js 15 (App Router)
- **State Management**: Redux Toolkit
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: JWT-based authentication

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
DATABASE_URL="mongodb://localhost:27017/uww-muhendislik"
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
pnpm --filter @task-app/frontend dev
```

### Frontend Structure

```
packages/frontend/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard and project pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── projects/           # Project-related components
│   ├── tasks/              # Task-related components
│   ├── profile/            # User profile components
│   ├── ui/                 # UI components (shadcn/ui)
│   └── redux-provider.tsx  # Redux provider component
├── lib/                    # Utility functions and libraries
│   ├── redux/              # Redux store and slices
│   │   ├── hooks.ts        # Redux hooks
│   │   ├── store.ts        # Redux store configuration
│   │   └── slices/         # Redux slices
│   └── utils.ts            # Utility functions
├── services/               # API services
│   ├── auth-service.ts     # Authentication service
│   ├── project-service.ts  # Project service
│   ├── task-service.ts     # Task service
│   └── notification-service.ts # Notification service
└── public/                 # Static assets
```

### Frontend Architecture

The frontend application follows a clean architecture pattern with the following layers:

1. **Presentation Layer**: React components and pages
2. **State Management Layer**: Redux store, slices, and actions
3. **Service Layer**: API services for data fetching and manipulation
4. **Model Layer**: TypeScript interfaces and types

#### Redux Architecture

The application uses Redux Toolkit for state management with the following slices:

1. **authSlice**: Manages user authentication state, including login, registration, and profile information.
2. **projectSlice**: Manages project-related state, including project list, current project, and project operations.
3. **taskSlice**: Manages task-related state, including task list, current task, and task operations.
4. **notificationSlice**: Manages notification-related state, including notification list and unread count.

Each slice follows a similar pattern:
- State definition with TypeScript interfaces
- Initial state configuration
- Async thunks for API calls
- Reducers for state updates
- Extra reducers for handling async thunk states (pending, fulfilled, rejected)

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

### API Structure

```
packages/api/
├── src/
│   ├── controllers/    # API endpoint handlers
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Mongoose database models
│   ├── routes/         # API endpoint routes
│   ├── services/       # Business logic services
│   ├── schemas/        # Zod validation schemas
│   ├── types/          # TypeScript type definitions
│   ├── config/         # Application configuration
│   ├── utils/          # Helper functions
│   ├── error/          # Error management tools
│   ├── handlers/       # Global handlers
│   ├── openapi/        # API documentation configuration
│   ├── app.ts          # Express application
│   └── server.ts       # HTTP server
├── tsconfig.json       # TypeScript configuration
└── package.json        # Package dependencies
```

