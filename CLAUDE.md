# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Crones** is a ride-sharing/transportation ordering platform built as a monorepo with three applications:
- **client/**: Customer-facing web app for booking rides
- **admin/**: Admin dashboard for managing orders and drivers
- **server/**: Express.js backend with PostgreSQL database and Socket.io for real-time chat

## Development Commands

### Client & Admin (identical commands)
```bash
cd client    # or cd admin
npm install
npm run dev       # Start Vite dev server (auto-proxies /api to localhost:3000)
npm run build     # TypeScript compilation + Vite production build
npm run lint      # Run ESLint
```

### Server
```bash
cd server
npm install
npm run dev       # Start server with --watch flag (auto-reload on changes)
npm run db        # Drop, create, migrate, and seed database (destructive!)
```

### Database Operations (Sequelize)
```bash
cd server
npx sequelize db:create                    # Create database
npx sequelize db:migrate                   # Run migrations
npx sequelize db:seed:all                  # Seed database
npx sequelize migration:generate --name <name>  # Create new migration
npx sequelize seed:generate --name <name>       # Create new seed
```

## Architecture

### Monorepo Structure
- Each application (client/admin/server) is independent with its own `package.json`
- No shared dependencies between applications
- Development proxy in Vite forwards `/api/*` and `/socket.io/*` to `http://localhost:3000`

### Frontend Architecture (Client & Admin)

Both frontends use **Feature-Sliced Design (FSD)** methodology:

```
src/
  ├── app/          # Application initialization, routing, Redux store
  ├── pages/        # Route-level page components
  ├── widgets/      # Complex composite UI components
  ├── features/     # User-facing features (auth, order forms, etc.)
  ├── entities/     # Business entities with data models and API services
  └── shared/       # Reusable utilities, hooks, axios instance, types
```

**FSD Layer Rules**:
- Layers can only import from layers below them (app → pages → widgets → features → entities → shared)
- ESLint enforces these boundaries via `eslint-plugin-fsd-layers`
- Entities should be self-contained with their own API/model/schema/thunks

**State Management**:
- Redux Toolkit with separate stores for client and admin
- Client store: `{ map, auth, orders }`
- Admin store: `{ order, user }`
- Thunks located in `entities/*/model/thunks.ts`
- Reducers in `entities/*/model/slice.ts` or `entities/*/model/index.ts`

**API Communication**:
- Axios instance configured in `shared/axiosInstance.ts`
- JWT access tokens in Authorization header
- Refresh tokens in HTTP-only cookies
- Automatic token refresh on 403 response via axios interceptor
- Base URL: `/api` (proxied in dev, direct in production)

### Backend Architecture

**Entry Point**: `server/src/server.js` initializes HTTP server and Socket.io
**App Setup**: `server/src/app.js` configures Express middleware and routes

**Routes**:
- `/api/auth` - Customer authentication (signup, login, refresh)
- `/api/admin` - Admin authentication (signin, signup, refresh)
- `/api/orders` - Order management (admin)
- `/api/customer/orders` - Customer order operations
- `/api/support/chat` - Support chat REST endpoints

**Database Models** (Sequelize ORM):
- `Customer` - name, phoneNumber, hashpass
- `Admin` - name, email, hashpass
- `Order` - customerId, driverId, from, to, totalCost, status, vehicle, isPaid, comments, finishedAt
  - Status: `'new' | 'in process' | 'finished' | 'cancelled'`
  - Vehicle: `'Седан' | 'Кроссовер' | 'Внедорожник'` (Russian enum)
- `Driver` - Referenced in Order model
- `SupportChat` - Chat room metadata
- `SupportMessage` - chatId, body, attachments, senderId, senderRole, timestamps

**Authentication**:
- JWT-based with access + refresh token pattern
- Middleware: `verifyAccessToken`, `verifyRefreshToken`, `verifyCustomerToken`
- Token generation: `utils/generateTokens.js`
- Password hashing: bcrypt 6.0

**Real-time Communication** (Socket.io):
- Namespace: `/support`
- Room-based chats (roomId = chatId)
- Events:
  - Client → Server: `support:join`, `support:message`, `support:leave`
  - Server → Client: `support:joined`, `support:message`, `support:presence`, `support:error`
- Messages persist in SupportMessage table
- Tracks active participants per room

### Key Data Flows

**Order Creation (Customer)**:
1. Customer submits form → validates with Zod schema
2. Frontend dispatches `createOrder` thunk → POST `/api/customer/orders`
3. Server saves Order with status='new'
4. Admin sees new order in dashboard

**Support Chat**:
1. Client connects to Socket.io `/support` namespace
2. Emits `support:join` with chatId or customerId/adminId
3. Server finds/creates SupportChat record and returns message history
4. Messages exchanged via `support:message` events
5. All messages persist in database

**Authentication Flow**:
1. Login → Server returns access token + sets refresh token cookie
2. Axios interceptor adds token to requests
3. On 403 → Axios calls `/api/auth/refresh` → receives new access token
4. Original request retried automatically

## Technology Stack

**Frontend**:
- React 19 + TypeScript 5.8 + Vite 6
- Redux Toolkit 2.x
- React Router 7
- Ant Design 5.28 (UI components)
- Material-UI 7.3 (client only)
- Socket.io-client 4.8
- Axios 1.13
- Zod 4.1 (validation)

**Backend**:
- Express 5.1
- PostgreSQL + Sequelize 6.37
- Socket.io 4.8
- JWT + bcrypt
- Nodemailer 7.0
- ioredis 5.8
- Telegraf 4.16 (Telegram bot)

## Important Notes

### When Working with Frontend Code
- Follow FSD layer hierarchy - never import from upper layers
- Keep entities self-contained with api/model/schema/ui folders
- Use existing axios instance from `shared/axiosInstance.ts`
- Redux thunks should be in `entities/*/model/thunks.ts`
- Schemas (Zod) should be in `entities/*/model/schema.ts`

### When Working with Backend Code
- Use Sequelize migrations for schema changes (never modify models directly in production)
- All routes require authentication except signup/login
- Socket.io handlers in `src/socket/supportChat.socket.js`
- Controllers should be thin - business logic in services when needed
- Environment variables must be configured in `.env` (see `.env.example`)

### When Working with Database
- Run `npm run db` in server directory to reset database (destructive!)
- Create migrations for schema changes: `npx sequelize migration:generate --name <name>`
- Models are in `server/db/models/`
- Migrations in `server/db/migrations/`
- Seeders in `server/db/seeders/`

### Cross-cutting Concerns
- Three user roles: Customer, Admin, Driver (driver features minimal)
- Vehicle types are Russian strings: 'Седан', 'Кроссовер', 'Внедорожник'
- All timestamps use Sequelize auto-managed createdAt/updatedAt
- Support chat messages support attachments (nullable field)
- Client and admin apps are completely independent - no shared state

## Environment Variables

Required in `server/.env`:
```
DB_USER=postgres
DB_PASS=your_password
DB_NAME=crones
DB_HOST=localhost
PORT=3000
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@example.com
```
