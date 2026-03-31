# PrepIQ

PrepIQ is an open-source interview preparation workspace for students and early-career professionals. It combines career profiling, interview prep plans, mock interview feedback, progress tracking, and job application management in one product.

## Why this project exists

Candidates typically manage prep notes, job tracking, and interview practice across disconnected tools. PrepIQ brings those workflows together so contributors can improve a practical full-stack product with meaningful frontend, backend, documentation, and DevOps work.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query, Framer Motion, Recharts
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Auth: signed bearer tokens with PBKDF2 password hashing
- Tooling: Vitest, Playwright, ESLint, Docker, Docker Compose

## Features

- Account signup and login
- Career DNA onboarding profile
- Interview prep plan generation
- Mock interview answer scoring and feedback
- Job application tracking
- Progress analytics dashboard

## Project structure

```text
backend/              FastAPI application and Python dependencies
docs/open-source/     Roadmap, labels, backlog, governance docs
src/                  React frontend
.github/              Issue templates and PR template
docker-compose.yml    One-command local environment
```

## Quick start

### Recommended: one-command local setup

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

### Manual setup

1. Start PostgreSQL and create a database named `prepiq`.
2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

4. Configure environment variables from `.env.example`.
5. Start the backend:

```bash
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

6. Start the frontend:

```bash
npm run dev
```

## Environment variables

See `.env.example`.

- `DATABASE_URL`
- `APP_SECRET`
- `ACCESS_TOKEN_TTL_HOURS`
- `CORS_ORIGINS`
- `VITE_API_BASE_URL`

## Validation

Frontend:

```bash
npm run build
npx tsc --noEmit
```

Backend:

```bash
python -m compileall backend
```

## Contributing

1. Read `CONTRIBUTING.md`
2. Review `docs/open-source/ROADMAP.md`
3. Pick an item from `docs/open-source/ISSUE_BACKLOG.md`

## Community files

- `LICENSE`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `docs/open-source/LABELS.md`
- `docs/open-source/ROADMAP.md`
- `docs/open-source/ISSUE_BACKLOG.md`
