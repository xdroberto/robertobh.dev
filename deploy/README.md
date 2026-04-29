# Deploy — robertobh.dev

Static SPA built with Vite, served by Nginx on a Hetzner VPS (`178.156.248.110`).

## First-time server setup

```bash
# As root on the VPS
mkdir -p /var/www/portfolio
chown -R www-data:www-data /var/www/portfolio

# TLS via certbot
apt-get install -y nginx certbot python3-certbot-nginx
certbot --nginx -d robertobh.dev -d www.robertobh.dev

# Install the site config
scp deploy/nginx.conf root@178.156.248.110:/etc/nginx/sites-available/robertobh.dev
ssh root@178.156.248.110 'ln -sf /etc/nginx/sites-available/robertobh.dev /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx'
```

## Continuous deploy

GitHub Actions workflow at `.github/workflows/deploy.yml`:

1. Push to `main`
2. CI runs typecheck + lint + format check + tests + build
3. `dist/` is uploaded over SCP to `/var/www/portfolio/`

The Nginx config is **not** redeployed automatically — only the static files are. Update it manually with the `scp + reload` commands above when the config changes.

## Security headers

The Nginx config sets:

- `Strict-Transport-Security` — force HTTPS for 1 year
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disable camera/mic/geolocation/FLoC
- `Content-Security-Policy` — restrict to self + Google Fonts + GitHub APIs

Verify after deploy:

```bash
curl -sI https://robertobh.dev | grep -iE 'strict-transport|x-content|x-frame|referrer|permissions|content-security'
```

Or run the headers through https://securityheaders.com — target an `A` grade.

## Verifying a deploy

```bash
# Health check
curl -sI https://robertobh.dev | head -5

# Bundle hashes match the latest build
curl -s https://robertobh.dev | grep -oE 'assets/[a-z]+-[A-Za-z0-9]+\.(js|css)'
```
