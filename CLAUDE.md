# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Crones is a full-stack order management application (appears to be a delivery/transportation service) built with:
- **Client**: React 19 + TypeScript + Vite
- **Server**: Node.js + Express + Sequelize ORM
- **Database**: PostgreSQL

## Architecture

### Monorepo Structure
- `client/` - Frontend React application
- `server/` - Backend Express API

### Server Architecture (MVC Pattern)
The server follows a clean MVC architecture with clear separation of concerns:

```
server/src/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── routes/             # Route definitions (REST endpoints)
├── controllers/        # Request handlers and response logic
├── services/           # Business logic layer
├── middlewares/        # JWT auth middleware (verifyAccessToken, verifyRefreshToken)
└── utils/

server/db/
├── models/             # Sequelize models (Customer, Driver, Order, Admin)
├── migrations/         # Database schema migrations
├── seeders/            # Test data seeders
└── database.js         # Sequelize configuration
```

**Key Architectural Pattern**:
- Routes → Controllers → Services → Models
- When creating new features, follow this existing pattern
- Controllers handle HTTP concerns, Services contain business logic

### Database Models & Relationships

Core entities:
- **Order**: Belongs to Customer and Driver
  - Status: 'new', 'in process', 'finished', 'cancelled'
  - Fields: from, to, totalCost, isPaid, vehicle, customerComment, adminComment, finishedAt
- **Customer**: Has many Orders
- **Driver**: Has many Orders
- **Admin**: Authentication entity

### Authentication
- JWT-based auth with access tokens and refresh tokens
- Middleware: `verifyAccessToken` and `verifyRefreshToken` in `server/src/middlewares/`
- Tokens use Bearer scheme: `Authorization: Bearer <token>`
- Admin authentication routes at `/api/auth`

### Client Architecture
- Built with Vite for fast HMV
- TypeScript strict mode enabled
- Path alias: `@/` maps to `src/`
- API proxy: `/api` requests proxied to `http://localhost:3000`

## Development Commands

### Server
```bash
cd server

# Start development server with hot reload
npm run dev

# Database operations (drop, create, migrate, seed all)
npm run db

# Linting
npm run lint
```

### Client
```bash
cd client

# Start Vite dev server (runs on port 5173 by default)
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Database Management

### Sequelize Configuration
- Config file: `server/db/database.js` (uses environment variables)
- Sequelize RC: `server/.sequelizerc` (defines paths for models, migrations, seeders)

### Working with Database

**Full reset** (drop, create, migrate, seed):
```bash
cd server
npm run db
```

**Individual Sequelize CLI commands**:
```bash
cd server

# Create new migration
npx sequelize migration:generate --name migration-name

# Run pending migrations
npx sequelize db:migrate

# Undo last migration
npx sequelize db:migrate:undo

# Create new seeder
npx sequelize seed:generate --name seeder-name

# Run all seeders
npx sequelize db:seed:all

# Undo seeders
npx sequelize db:seed:undo:all
```

### Environment Variables

**Server** (`server/.env`):
```
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
PORT=3000
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_SECRET=your_access_secret
```

**Client** (`client/.env`):
```
VITE_APP_TITLE=App Title
```

## Code Style & Linting

Both client and server use Elbrus Bootcamp ESLint configuration:
- `@elbrus/eslint-config`
- `@elbrus/eslint-plugin`

Client additionally uses:
- `eslint-plugin-fsd-layers` (Feature-Sliced Design enforcement)
- `eslint-plugin-react-hooks`
- TypeScript ESLint

## API Structure

Current API endpoints:
- `/api/auth/*` - Admin authentication
- `/api/orders/*` - Order CRUD operations
  - GET `/api/orders` - Get all orders
  - POST `/api/orders` - Create order
  - GET `/api/orders/:id` - Get specific order
  - PUT `/api/orders/:id` - Update order
  - DELETE `/api/orders/:id` - Delete cancelled order
  - PATCH `/api/orders/:id/status` - Update order status
  - PATCH `/api/orders/:id/isPaid` - Update payment status
  - PATCH `/api/orders/:id/customerComment` - Update customer comment
  - PATCH `/api/orders/:id/adminComment` - Update admin comment
  - PATCH `/api/orders/:id/totalCost` - Update total cost

Note: Driver routes exist in the codebase but are not yet mounted in `app.js`.

## Git Workflow

- Main branch: `main`
- Current working branch: `server-bd`
- Feature branches are merged via pull requests

## Adding New Features

When adding new entities/features, follow the established pattern:

1. **Database**: Create migration in `server/db/migrations/`
2. **Model**: Create Sequelize model in `server/db/models/`
3. **Service**: Implement business logic in `server/src/services/`
4. **Controller**: Handle HTTP in `server/src/controllers/`
5. **Routes**: Define endpoints in `server/src/routes/`
6. **Mount**: Add router to `server/src/app.js`

Example: The driver feature has files created but routes are not yet mounted in app.js.
