# Angular Task Manager

Aplikacija za upravljanje taskovima, korisnicima i projektima. Angular 18 + NestJS + Prisma + SQLite.

## Tech stack

- **Frontend:** Angular 18, TypeScript, Tailwind CSS, Reactive Forms
- **Backend:** NestJS, Prisma ORM, SQLite
- **Tests:** Karma (unit), Jest (backend), Playwright (E2E)

## Struktura

```
├── backend/     # NestJS API, Prisma, SQLite
├── frontend/    # Angular aplikacija
└── tests/       # Playwright E2E testovi
```

## Pokretanje

```bash
# 1. Instalacija
npm run install:all

# 2. Backend – migracija i seed
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
# API: http://localhost:3000
# Swagger: http://localhost:3000/api

# 3. Frontend (novi terminal)
npm start
# App: http://localhost:4200
```

## Skripte

| Komanda | Opis |
|--------|------|
| `npm start` | Frontend dev server |
| `npm run start:backend` | Backend dev server |
| `npm run build` | Build frontend |
| `npm run build:backend` | Build backend |
| `npm test` | Frontend unit testovi |
| `npm run test:backend` | Backend unit testovi |
| `npm run test:backend:e2e` | Backend E2E testovi |
| `npm run e2e` | Playwright E2E |
| `npm run db:migrate` | Prisma migracija |
| `npm run db:seed` | Seed baze |

## Login

- **Email:** demo@example.com
- **Password:** password123

## API dokumentacija

Swagger: http://localhost:3000/api

## Testiranje

```bash
# Frontend unit
cd frontend && npm test -- --no-watch --browsers=ChromeHeadless

# Backend unit + E2E
cd backend && npm test && npm run test:e2e
```
