# Office SDK deployment

This repository deploys the static Vite build to the Ubuntu/Nginx origin at `43.172.115.22` through GitHub Actions.

## Production path

1. A push to `main` runs `npm ci` and `npm run build` on GitHub Actions.
2. The workflow uploads the release archive and `deploy/nginx/officesdk.conf` over SSH.
3. The release is extracted into `/var/www/officesdk/releases/<release-id>`.
4. `/var/www/officesdk/current` is switched atomically to the new release.
5. Nginx is validated and reloaded.
6. The workflow checks the website through the public IP with `Host: officesdk.com`.

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
npm run build
```

Once a release has been deployed, verify the IP before DNS is changed:

```bash
curl -H 'Host: officesdk.com' http://43.172.115.22/
curl -H 'Host: officesdk.com' http://43.172.115.22/robots.txt
curl -H 'Host: officesdk.com' http://43.172.115.22/sitemap.xml
```

After the DNS owner points `officesdk.com` to `43.172.115.22`, configure the required TLS/Cloudflare mode for the domain and repeat the checks over HTTPS.
