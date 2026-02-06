# Deployment

## Vercel
- Portal: patternslab.app
- Investor: patternslab.work

## CI/CD
- `.github/workflows/ci.yml` — lint, type check, build on PR
- `.github/workflows/deploy.yml` — Vercel deploy on main push
- `.github/workflows/security.yml` — dependency audit (weekly)
- `.github/workflows/publish.yml` — npm publish on release
