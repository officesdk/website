# Office SDK website

The public Office SDK marketing site is a Vite + React static application. It is intentionally an orientation and conversion layer for Office file workflows; detailed API behavior remains in the current [Office SDK API reference](https://officesdk.apifox.cn/).

## Local development

```bash
npm ci
npm run dev
```

Build the production assets with:

```bash
npm run build
```

## Deployment

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow builds the site on GitHub-hosted runners and deploys a versioned release to `ubuntu@43.172.115.22`, then verifies the site through the IP with `Host: officesdk.com`.

Deployment paths, required Actions secrets, Nginx setup, and DNS handoff are documented in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
