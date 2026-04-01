# v5 Release Checklist

## Build and quality gate
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] `npm run eval:retrieval`
- [ ] `npx playwright test`

## Security gate
- [ ] `npx semgrep --config auto app/ lib/ --quiet`
- [ ] `npm audit --audit-level=high`

## Container runtime gate
- [ ] `docker build .`
- [ ] `docker compose up --build -d`
- [ ] `curl -sSf http://127.0.0.1:3000`
- [ ] `docker compose down`

## Environment validation
- [ ] `.env` contains `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env` contains `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `.env` contains `DIFY_API_KEY`
- [ ] `.env` contains `DIFY_BASE_URL`

## Sign-off artifacts
- [ ] `sprints/v5/artifacts/retrieval-eval-latest.json` updated
- [ ] `sprints/v5/WALKTHROUGH.md` updated
- [ ] smoke-test evidence captured from `sprints/v5/artifacts/smoke-test-playbook.md`
