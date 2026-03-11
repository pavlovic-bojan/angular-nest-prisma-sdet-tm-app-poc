# Angular Task Manager

Angular 18 standalone SPA for task management. Connects to the NestJS backend API for users, projects, and tasks.

## Tech stack

- **Angular** 18 – standalone components, signals, control flow
- **Tailwind CSS** – styling
- **RxJS** – reactive streams
- **Karma + Jasmine** – unit and component tests

## Structure

```
src/
├── app/
│   ├── core/              # Core modules
│   │   ├── guards/        # Auth guard
│   │   ├── models/        # User, Project, Task
│   │   └── services/      # API, Auth, User, Project, Task, Theme, Layout
│   ├── features/          # Feature modules
│   │   ├── auth/          # Login
│   │   ├── users/         # User list & form
│   │   ├── projects/      # Project list & form
│   │   └── tasks/         # Task list & form
│   ├── shared/            # Shared components & pipes
│   │   ├── components/    # Layout, Sidebar, Topbar, Drawer, ConfirmDialog, TablePagination
│   │   └── pipes/         # StatusLabel, DateFormat
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/          # environment.ts, environment.prod.ts
└── styles.css
```

## Running

```bash
# Install dependencies
npm install

# Development server (default: http://localhost:4200)
npm start
```

Ensure the backend API is running at `http://localhost:3000` (see `backend/README.md`).

## Environment

- **Development**: `apiUrl: 'http://localhost:3000'` in `environments/environment.ts`
- **Production**: override in `environments/environment.prod.ts` for your API URL

## Tests

```bash
# Unit and component tests (Karma)
npm test

# Run with coverage (add --code-coverage to ng test)
npx ng test --no-watch --code-coverage
```

## Test coverage

Run `npx ng test --no-watch --code-coverage` to generate coverage report (output in `coverage/`).

| Metric    | Coverage |
|-----------|----------|
| Statements| ~84%     |
| Branches  | ~56%     |
| Functions | ~72%     |
| Lines     | ~86%     |

**Covered:**
- **Services**: ApiService, AuthService, UserService, ProjectService, TaskService, ThemeService, LayoutService
- **Guards**: AuthGuard
- **Components**: App, Login, Layout, Sidebar, Topbar, Drawer, ConfirmDialog, TablePagination, UserList, UserForm, ProjectList, ProjectForm, TaskList, TaskForm
- **Pipes**: StatusLabelPipe, DateFormatPipe

## Routes

| Path     | Description                        | Guard  |
|----------|------------------------------------|--------|
| /login   | Login page                         | –      |
| /tasks   | Task list (default after login)    | authGuard |
| /users   | User list                          | authGuard |
| /projects| Project list                       | authGuard |

## Login

Demo credentials (must match backend seed):

- **Email:** demo@example.com  
- **Password:** password123

## Build

```bash
# Production build
npm run build

# Output: dist/app/
```
