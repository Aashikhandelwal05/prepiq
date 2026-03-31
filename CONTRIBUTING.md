# Contributing to PrepIQ

## Before you start

1. Read the `README.md`
2. Review `docs/open-source/ROADMAP.md`
3. Pick a scoped task from `docs/open-source/ISSUE_BACKLOG.md`

## Local setup

Recommended:

```bash
docker compose up --build
```

Manual:

```bash
npm install
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
npm run dev
```

## Branching

- Branch from `main`
- Use descriptive names such as `feat/job-filters` or `fix/auth-expiry-redirect`

## Pull request expectations

- Keep changes scoped
- Explain the problem and the chosen approach
- Include screenshots for UI changes
- Update docs when setup or behavior changes
- Add tests when practical

## Validation

```bash
npm run build
npx tsc --noEmit
python -m compileall backend
```

## Collaboration guidelines

- Ask clarifying questions early
- Describe blockers clearly
- Call out API or schema changes explicitly
