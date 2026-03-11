# Task Manager API – Performance Tests (k6)

k6 performance tests for the Task Manager NestJS backend. All tests use minimal load (1–4 VUs, short duration) for fast validation in CI/CD.

## Test Scenarios

| Test        | Description           | VUs | Duration   |
|-------------|-----------------------|-----|------------|
| **smoke**   | Health + login + CRUD | 1   | 3 iterations |
| **baseline**| Steady load           | 2   | 1 min      |
| **load**    | Ramp 0→2 VUs          | 2   | ~2 min     |
| **stress**  | Ramp 2→4 VUs          | 4   | ~2 min     |
| **spike**   | Spike 2→4→2 VUs       | 4   | ~1 min     |
| **breakpoint** | Ramp 2→4 VUs       | 4   | ~1.5 min   |
| **soak**    | 2 req/s, 1 min        | 2–4 | 1 min      |

## Prerequisites

- **k6** – standalone binary (not npm)
  - macOS: `brew install k6`
  - Linux: [k6 docs](https://k6.io/docs/getting-started/installation/)

## Configuration

### Required

- `BASE_URL` – Backend URL (e.g. `http://localhost:3000`), no trailing slash

### Optional

- `LOGIN_EMAIL` – Demo user email (default: `demo@example.com`)
- `LOGIN_PASSWORD` – Demo user password (default: `password123`)

### Example

```bash
# Default (localhost:3000, demo credentials)
BASE_URL=http://localhost:3000 npm run smoke

# Custom credentials
BASE_URL=http://localhost:3000 LOGIN_EMAIL=demo@example.com LOGIN_PASSWORD=password123 npm run smoke
```

## Running

### From `tests/performance/`

```bash
cd tests/performance
npm run test      # smoke (default for CI)
npm run smoke
npm run baseline
npm run load
npm run stress
npm run spike
npm run breakpoint
npm run soak
npm run all       # smoke + baseline + load
```

### Run script

```bash
cd tests/performance
chmod +x run.sh
BASE_URL=http://localhost:3000 ./run.sh smoke
./run.sh all
```

### From project root

```bash
BASE_URL=http://localhost:3000 npm run tests:performance --prefix tests
```

Add to root `package.json`:

```json
"tests:performance": "npm run smoke --prefix tests/performance"
```

## HTML Report

Each run generates an HTML report at `k6-report/index.html` (relative to the directory from which k6 is run). When using `run.sh`, the report is written to `tests/performance/k6-report/`.

## Endpoints Tested

| Method | Endpoint      | Description   |
|--------|---------------|---------------|
| GET    | /             | Health ("Hello World!") |
| POST   | /auth/login   | Login (demo credentials) |
| GET    | /users        | List users    |
| GET    | /projects     | List projects |
| GET    | /tasks        | List tasks    |

## Structure

```
tests/performance/
├── lib/
│   ├── config.js    # BASE_URL, thresholds
│   ├── summary.js   # HTML report (handleSummary)
│   ├── auth.js      # Request headers
│   ├── api.js       # getHealth, postLogin, getUsers, getProjects, getTasks
│   ├── scenarios.js # VU/iteration config
│   └── utils.js
├── smoke/
├── baseline/
├── load/
├── stress/
├── spike/
├── breakpoint/
├── soak/
├── data/
├── run.sh
├── .env.example
├── package.json
└── README.md
```

## Backend Setup

Ensure the backend is running before tests:

```bash
cd backend
npm run start:dev
```

Seed data (demo user, projects, tasks):

```bash
npm run prisma:seed --prefix backend
```
