# API Gateway

Central API Gateway for Ask-to-Pro Backend microservices.

## Features

- **CORS Handling**: Centralized CORS policy configuration
- **JWT Validation**: Validates JWT tokens for protected routes
- **Request Routing**: Routes requests to appropriate microservices
- **Logging**: Basic request/response logging
- **Service Discovery**: Automatic routing based on path patterns

## Architecture

```
Client Request
    ↓
API Gateway (Port 3000)
    ├── CORS Middleware
    ├── Logging Middleware
    ├── JWT Validation (skip for public routes)
    └── Proxy to Services
        ├── Auth Service (Port 4000)
        └── Mentor Service (Port 5000)
```

## Public Routes (No JWT Required)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset/:token`
- `POST /api/v1/auth/refresh`

## Protected Routes (JWT Required)

All other routes require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Environment Variables

See `.env.example` for required environment variables.

## Running Locally

```bash
npm install
npm run build
npm start
```

For development:
```bash
npm run dev
```

## Docker

The gateway is included in the main `docker-compose.yml` file.

