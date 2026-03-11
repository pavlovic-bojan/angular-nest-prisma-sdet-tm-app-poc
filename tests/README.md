# Tests

Unified test suite for the Task Manager application: **E2E API**, **E2E UI**, and **performance** tests.

## Structure

```
tests/
├── e2e/
│   ├── api/                    # API tests (REST + JSON Schema)
│   │   ├── features/           # Gherkin .feature files
│   │   │   ├── app.feature
│   │   │   ├── auth.feature
│   │   │   ├── users.feature
│   │   │   ├── projects.feature
│   │   │   └── tasks.feature
│   │   ├── step_definitions/
│   │   │   └── steps.ts
│   │   ├── context.ts          # Shared API context
│   │   └── schemas/            # JSON schemas (AJV)
│   │       ├── user.schema.json
│   │       ├── project.schema.json
│   │       ├── task.schema.json
│   │       ├── login-response.schema.json
│   │       └── delete-response.schema.json
│   ├── ui/                     # UI tests (Playwright)
│   │   ├── features/
│   │   │   ├── login.feature
│   │   │   ├── logout.feature
│   │   │   ├── navigation.feature
│   │   │   ├── tasks.feature
│   │   │   ├── users.feature
│   │   │   └── projects.feature
│   │   ├── step_definitions/
│   │   │   └── steps.ts
│   │   └── pages/              # Page Object Model
│   │       ├── LoginPage.ts
│   │       ├── TasksPage.ts
│   │       ├── UsersPage.ts
│   │       └── ProjectsPage.ts
│   └── helpers/
│       ├── schema-validator.ts
│       └── SchemaValidator.ts  # CodeceptJS custom helper
├── performance/                # k6 load tests
│   └── README.md               # → [Performance tests documentation](performance/README.md)
├── codecept.api.conf.ts
├── codecept.ui.conf.ts
├── output/                     # Screenshots, reports
├── allure-results/
└── package.json
```

## Stack

- **CodeceptJS** – BDD test framework
- **Playwright** – Browser automation for UI tests
- **TypeScript** – Type safety across all tests
- **Gherkin** – Human-readable scenarios
- **Allure** – Test reporting
- **AJV** – JSON Schema validation (API tests)

## Prerequisites

1. **Install dependencies**
   ```bash
   cd tests && npm install
   ```

2. **Browsers (UI tests)**
   ```bash
   npx playwright install chromium
   ```

3. **Running services**
   - **Backend** at `http://localhost:3000`
   - **Frontend** at `http://localhost:4200` (required for UI tests)

4. **Seed data** (demo user, projects, tasks)
   ```bash
   npm run db:seed
   ```

## Running

```bash
cd tests

# API tests only (no browser, backend required)
npm run test:api

# UI tests only (frontend + backend required)
npm run test:ui

# All E2E tests
npm test
```

### Allure reports (locally)

```bash
npm run test:api:report   # API tests + open report
npm run test:ui:report    # UI tests + open report
npm run test:report       # All tests + open report
```

### CI reports (GitHub Pages)

| Report | URL |
|--------|-----|
| **Landing** | [pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/) |
| **Allure (E2E)** | [allure/](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/allure/) |
| **Performance (k6)** | [load/](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/load/) |

---

## API Tests

- **Purpose**: Validate backend REST API against JSON schemas
- **Format**: Gherkin features + REST helper + AJV schema validation

### Coverage

| Feature | Endpoints | Scenarios |
|---------|-----------|-----------|
| **App** | `GET /` | Health check |
| **Auth** | `POST /auth/login` | Valid login, invalid credentials (401) |
| **Users** | `GET/POST/PUT/DELETE /users` | CRUD, 404 for non-existent |
| **Projects** | `GET/POST/PUT/DELETE /projects` | CRUD, 404 for non-existent |
| **Tasks** | `GET/POST/PUT/DELETE /tasks` | CRUD, filter by `projectId`, 404 |

### JSON Schemas

- `User`, `Project`, `Task` – entity schemas
- `LoginResponse` – auth response
- `DeleteResponse` – delete confirmation

---

## UI Tests

- **Purpose**: End-to-end user flows in the browser
- **Format**: Gherkin features + Playwright + Page Object Model (POM)
- **Note**: Uses sidebar navigation (no full page reload) to preserve auth state

### Coverage

| Feature | Scenarios |
|---------|-----------|
| **Login** | Login page, valid login, invalid credentials, redirect |
| **Logout** | User menu, logout, redirect to login |
| **Navigation** | Tasks, Users, Projects via sidebar |
| **Tasks** | List, Add Task drawer, create, cancel |
| **Users** | List, Add User drawer, create, cancel |
| **Projects** | List, Add Project drawer, create, cancel |

### Page Objects

- `LoginPage` – login form, credentials, submit
- `TasksPage` – tasks list, Add Task
- `UsersPage` – users list, Add User
- `ProjectsPage` – projects list, Add Project

---

## Performance Tests

k6 load tests for the Task Manager API. Scenarios: smoke, baseline, load, stress, spike, breakpoint, soak.

See **[performance/README.md](performance/README.md)** for:

- Test scenarios and VU configuration
- Prerequisites (k6 installation)
- Running from `tests/performance/` or project root
- Environment variables (`BASE_URL`, `LOGIN_EMAIL`, `LOGIN_PASSWORD`)
- HTML report location

Quick run from project root:

```bash
BASE_URL=http://localhost:3000 npm run tests:performance
```
