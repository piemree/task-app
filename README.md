# Advanced Task Management and Workflow Application

This project is a comprehensive workflow application for managing projects and tasks.

## Project Structure

This project is configured as a monorepo using PNPM Workspace. It contains two main packages:

- `packages/frontend`: Frontend application built with Next.js (under development)
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
│   └── frontend/            # Frontend application (under development)
│
├── node_modules/            # Root dependencies
├── package.json             # Root package configuration
├── pnpm-workspace.yaml      # PNPM workspace configuration
├── pnpm-lock.yaml           # PNPM lock file
└── biome.json               # Biome configuration
```

## Technologies

### Frontend

(Under development)

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
```

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

