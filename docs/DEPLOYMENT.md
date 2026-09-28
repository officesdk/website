# Office SDK deployment

This repository deploys the static Astro build to the Ubuntu/Nginx origin at `43.172.115.22` through GitHub Actions. Astro generates the complete route tree under `dist/`; React islands are hydrated only for browser interactions and do not require a server runtime after deployment.

## Production path

1. A push to `main` runs `npm ci` and the Astro `npm run build` command on GitHub Actions.
2. The workflow uploads the release archive and `deploy/nginx/officesdk.conf` over SSH.
3. The release is extracted into `/var/www/officesdk/releases/<release-id>`.
4. `/var/www/officesdk/current` is switched atomically to the new release.
5. Nginx is validated before activation, then reloaded. The previous release target and a copy of its Nginx configuration are retained; activation or origin health-check failures restore both automatically.
6. The workflow checks the website through the public IP with `Host: officesdk.com` and `X-Forwarded-Proto: https` to reproduce HTTPS traffic from Cloudflare.

The deployment does not touch the existing ShimoDocs release tree.

## GitHub Actions configuration

Create a public repository at `https://github.com/officesdk/website`, push this repository to its `main` branch, and add these repository Actions secrets:

| Secret | Value |
| --- | --- |
| `DEPLOY_SSH_KEY` | The complete private key corresponding to the public key authorized for `ubuntu@43.172.115.22` |
| `DEPLOY_KNOWN_HOSTS` | The exact host-key line for `43.172.115.22` |
| `DEPLOY_SUDO_PASSWORD` | Optional fallback only when the deploy user does not have passwordless sudo; leave unset on the current server |

The current `ubuntu@43.172.115.22` account was verified to run the deployment activation script with `sudo -n bash`, so no sudo password needs to be stored in GitHub Actions for this host.

The workflow has defaults for these repository variables, so variables are optional. They can be set explicitly when the infrastructure changes:

| Variable | Default |
| --- | --- |
| `DEPLOY_HOST` | `43.172.115.22` |
| `DEPLOY_PORT` | `22` |
| `DEPLOY_USER` | `ubuntu` |

Generate the host-key value on a trusted machine with:

```bash
ssh-keyscan -H 43.172.115.22
```

Do not commit a private key, sudo password, or the `.workbuddy/` directory.

## Local verification

```bash
npm ci
npm run dev       # Astro development server on port 4173
npm run build     # static Astro output in dist/
npm run preview   # serve the built dist/ directory locally
```

The release archive contains the static route output, such as `dist/index.html`, `dist/product/index.html`, `dist/blog/index.html`, and one `dist/blog/<slug>/index.html` for each article. Nginx serves these files directly; no Astro or React process is started on the origin.

## Canonical URL Routing

Public pages use `https://officesdk.com` and omit the trailing slash except on the homepage. HTTP and `www.officesdk.com` redirect permanently to the HTTPS apex domain. Non-homepage trailing slashes and `index.html` aliases redirect to the corresponding canonical path, preserving query parameters. Nginx reads each canonical path directly from its generated `index.html`, so sitemap and canonical URLs return `200` without a directory redirect. Unknown pages and missing assets return `404`.

Cloudflare terminates public HTTPS and sends the original protocol in `X-Forwarded-Proto`; the HTTP origin uses that header to prevent redirect loops. Requests made directly to the origin over HTTP redirect to the public HTTPS site. This configuration is scoped to the Office SDK hostnames.

Nginx backups are saved as `/var/www/officesdk/backups/nginx-<release-id>.conf`; the previous release target is recorded in `previous-release-<release-id>.txt` in the same directory. To roll back manually, restore that configuration, point `/var/www/officesdk/current` to the recorded previous release under `releases/`, run `sudo nginx -t`, and reload Nginx only after validation succeeds.

Once a release has been deployed, verify the IP before DNS is changed:

```bash
curl -H 'Host: officesdk.com' -H 'X-Forwarded-Proto: https' http://43.172.115.22/
curl -H 'Host: officesdk.com' -H 'X-Forwarded-Proto: https' http://43.172.115.22/blog
curl -H 'Host: officesdk.com' -H 'X-Forwarded-Proto: https' http://43.172.115.22/robots.txt
curl -H 'Host: officesdk.com' -H 'X-Forwarded-Proto: https' http://43.172.115.22/sitemap.xml
```

After the DNS owner points `officesdk.com` to `43.172.115.22`, configure the required TLS/Cloudflare mode for the domain and repeat the checks over HTTPS.
