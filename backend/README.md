# Task Manager API

NestJS REST API for the Angular Task Manager application. Uses Prisma ORM and SQLite.

## Tech stack

- **NestJS** 11
- **Prisma** 5 – ORM
- **SQLite** – database
- **class-validator** – DTO validation
- **Swagger** – API documentation

## Structure

```
src/
├── auth/          # Login (demo credentials)
├── users/         # User CRUD
├── projects/      # Project CRUD
├── tasks/         # Task CRUD
├── prisma/        # Prisma client
├── common/        # HTTP exception filter
└── main.ts
```

## API endpoints

| Method | Endpoint      | Description      |
|--------|---------------|------------------|
| POST   | /auth/login   | Login            |
| GET    | /users        | List users       |
| GET    | /users/:id    | User by ID       |
| POST   | /users        | Create           |
| PUT    | /users/:id    | Update           |
| DELETE | /users/:id    | Delete           |
| GET    | /projects     | List projects    |
| GET    | /projects/:id | Project by ID    |
| POST   | /projects     | Create           |
| PUT    | /projects/:id | Update           |
| DELETE | /projects/:id | Delete           |
| GET    | /tasks        | List tasks       |
| GET    | /tasks/:id    | Task by ID       |
| POST   | /tasks        | Create           |
| PUT    | /tasks/:id    | Update           |
| DELETE | /tasks/:id    | Delete           |

## Running

```bash
# Installation
npm install

# Generate Prisma client
npx prisma generate

# Database migration
npx prisma migrate dev --name init

# Seed (demo data)
npm run prisma:seed

# Dev server
npm run start:dev
```

API: http://localhost:3000  
**Swagger**: http://localhost:3000/api

## Login credentials

- **Email:** demo@example.com
- **Password:** password123

## Tests

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

**Coverage:**
- **Unit** (~34% overall): AuthService, UsersService, ProjectsService, TasksService, AppController
- **E2E** (20 tests): All API endpoints (auth, users, projects, tasks, Swagger)

## Prisma

```bash
npx prisma generate   # Generate client
npx prisma migrate dev # Migrations
npx prisma studio     # Database GUI
```
