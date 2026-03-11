# GitHub Actions

CI workflows for Task Manager. **Frontend** is deployed on Vercel. **Backend** is not hosted yet.

## Deployment

| App | URL | Status |
|-----|-----|--------|
| **Frontend** | [angular-nest-prisma-sdet-tm-app-poc.vercel.app](https://angular-nest-prisma-sdet-tm-app-poc.vercel.app) | ✅ Vercel |
| **Backend** | — | ❌ Not hosted (SQLite, local only) |

> **Note:** Frontend production build uses `apiUrl: '/api'`. When backend is hosted, update `frontend/src/environments/environment.prod.ts` or configure via Vercel env vars so the API points to the backend URL.

## Workflows

| Workflow        | Trigger                 | Description                              |
|-----------------|-------------------------|------------------------------------------|
| **ci.yml**      | Push/PR to main/master  | Backend + frontend lint/test/build + E2E |
| **backend-ci.yml**  | Backend changes      | Backend lint, test, build                |
| **frontend-ci.yml** | Frontend changes     | Frontend test, build                     |
| **e2e.yml**     | Tests/frontend/backend  | API + UI E2E tests                       |
| **performance.yml** | Manual only          | k6 load tests (requires BASE_URL)        |

## Prerequisites

- **Backend**: SQLite (`file:./prisma/dev.db`), no hosted DB
- **Performance**: Provide `BASE_URL` when running (e.g. `http://localhost:3000` or future hosted backend)
- **Secrets** (optional): `LOGIN_EMAIL`, `LOGIN_PASSWORD` for performance tests (default: demo@example.com / password123)

## Reports

- **Allure** (E2E): Artifact + deploy na GitHub Pages (branch `gh-pages`, path `allure/`). Uključi **GitHub Pages** u Settings → Pages → Source: gh-pages.
- **k6** (Performance): Generated in `tests/performance/k6-report/`

### E2E Production mode

Manual run **E2E Tests** → check **Run against production** → uses `BACKEND_URL` and `FRONTEND_URL` secrets.

See [tests/README.md](../tests/README.md) and [tests/performance/README.md](../tests/performance/README.md) for test docs.
