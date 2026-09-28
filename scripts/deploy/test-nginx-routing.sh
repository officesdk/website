#!/usr/bin/env bash
set -euo pipefail

if [[ "${NGINX_TEST_WORKER:-0}" != 1 ]]; then
  script_path="${BASH_SOURCE[0]}"
  config_path="$(cd "$(dirname "$script_path")/../.." && pwd)/deploy/nginx/officesdk.conf"
  ssh_target=""
  smoke_only=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --ssh) ssh_target="$2"; shift 2 ;;
      --config) config_path="$2"; shift 2 ;;
      --smoke) smoke_only=1; shift ;;
      *) printf 'Usage: bash %s [--ssh user@host] [--config path] [--smoke]\n' "$script_path" >&2; exit 2 ;;
    esac
  done
  encoded_config="$(base64 < "$config_path" | tr -d '\n')"
  if [[ -n "$ssh_target" ]]; then
    ssh -T -o BatchMode=yes -o ConnectTimeout=10 "$ssh_target" \
      "NGINX_TEST_WORKER=1 NGINX_TEST_SMOKE_ONLY=$smoke_only NGINX_TEST_CONFIG_BASE64='$encoded_config' bash -s" < "$script_path"
  else
    NGINX_TEST_WORKER=1 NGINX_TEST_SMOKE_ONLY="$smoke_only" NGINX_TEST_CONFIG_BASE64="$encoded_config" bash "$script_path"
  fi
  exit
fi

command -v nginx >/dev/null
command -v curl >/dev/null
test_dir="$(mktemp -d "${TMPDIR:-/tmp}/officesdk-nginx-routing.XXXXXX")"
nginx_pid=""
cleanup() {
  if [[ -n "$nginx_pid" ]]; then
    kill "$nginx_pid" 2>/dev/null || true
    wait "$nginx_pid" 2>/dev/null || true
  fi
  rm -rf "$test_dir"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

decode_base64() {
  if base64 --decode </dev/null >/dev/null 2>&1; then
    base64 --decode
  else
    base64 -D
  fi
}

port=$((20000 + RANDOM))
if command -v ss >/dev/null; then
  while [[ -n "$(ss -H -ltn "sport = :$port")" ]]; do
    port=$((20000 + RANDOM))
  done
fi
fixture_root="$test_dir/site"
mkdir -p "$fixture_root/blog/story" "$fixture_root/assets"
printf '<!doctype html><html><body>HOME_FIXTURE</body></html>\n' > "$fixture_root/index.html"
printf '<!doctype html><html><body>BLOG_FIXTURE</body></html>\n' > "$fixture_root/blog/index.html"
printf '<!doctype html><html><body>ARTICLE_FIXTURE</body></html>\n' > "$fixture_root/blog/story/index.html"
printf '<!doctype html><html><body>NOT_FOUND_FIXTURE</body></html>\n' > "$fixture_root/404.html"
printf '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://officesdk.com/blog/story</loc></url></urlset>\n' > "$fixture_root/sitemap.xml"
printf 'User-agent: *\nAllow: /\nSitemap: https://officesdk.com/sitemap.xml\n' > "$fixture_root/robots.txt"
printf '%s' 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH1kAAAAASUVORK5CYII=' | decode_base64 > "$fixture_root/assets/pixel.png"
printf '%s' "$NGINX_TEST_CONFIG_BASE64" | decode_base64 > "$test_dir/site.conf"

# Keep the production server rules, replacing only its listener and document root.
sed -E \
  -e "s@listen 80;@listen 127.0.0.1:$port;@g" \
  -e '/listen \[::\]:80;/d' \
  -e "s@root /var/www/officesdk/current;@root $fixture_root;@g" \
  "$test_dir/site.conf" > "$test_dir/isolated-site.conf"
{
  printf 'pid %s/nginx.pid;\nerror_log %s/error.log warn;\nevents { worker_connections 64; }\nhttp {\n' "$test_dir" "$test_dir"
  printf 'access_log off;\ntypes { text/html html; text/xml xml; text/plain txt; image/png png; }\n'
  printf 'default_type application/octet-stream;\n'
  printf 'include %s/isolated-site.conf;\n}\n' "$test_dir"
} > "$test_dir/nginx.conf"

nginx -t -p "$test_dir/" -c "$test_dir/nginx.conf" -e "$test_dir/error.log"
nginx -p "$test_dir/" -c "$test_dir/nginx.conf" -e "$test_dir/error.log" -g 'daemon off; master_process off;' &
nginx_pid=$!
ready=0
for attempt in {1..30}; do
  if curl --silent --max-time 1 --output /dev/null -H 'Host: officesdk.com' -H 'X-Forwarded-Proto: https' "http://127.0.0.1:$port/"; then
    ready=1
    break
  fi
  sleep 0.1
done
if [[ "$ready" != 1 ]]; then
  printf 'Isolated Nginx did not start.\n' >&2
  exit 1
fi

checks=0
failures=0
response_header() {
  awk -v name="$1" '
    index(tolower($0), tolower(name) ":") == 1 {
      sub(/^[^:]*:[[:space:]]*/, "")
      sub(/\r$/, "")
      print
      exit
    }
  ' "$test_dir/headers"
}

check_request() {
  local label="$1" host="$2" path="$3" forwarded_proto="$4" expected_status="$5" expected_location="$6" expected_mime="$7" expected_body="$8"
  local headers=(-H "Host: $host")
  if [[ -n "$forwarded_proto" ]]; then
    headers+=(-H "X-Forwarded-Proto: $forwarded_proto")
  fi
  local status location content_type failed=0
  status="$(curl --silent --show-error --max-time 5 --path-as-is "${headers[@]}" \
    --dump-header "$test_dir/headers" --output "$test_dir/body" --write-out '%{http_code}' "http://127.0.0.1:$port$path")"
  location="$(response_header Location)"
  content_type="$(response_header Content-Type)"
  checks=$((checks + 1))
  if [[ "$status" != "$expected_status" || "$location" != "$expected_location" ]]; then
    printf 'FAIL %s: expected status=%s location=%s; got status=%s location=%s\n' "$label" "$expected_status" "$expected_location" "$status" "$location"
    failed=1
  fi
  if [[ -n "$expected_mime" && "$content_type" != "$expected_mime"* ]]; then
    printf 'FAIL %s: expected MIME=%s; got %s\n' "$label" "$expected_mime" "$content_type"
    failed=1
  fi
  if [[ -n "$expected_body" ]] && ! grep -Fq "$expected_body" "$test_dir/body"; then
    printf 'FAIL %s: expected body marker=%s\n' "$label" "$expected_body"
    failed=1
  fi
  if [[ "$failed" == 1 ]]; then
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$label"
  fi
}

check_request 'HTTP homepage' officesdk.com / '' 301 https://officesdk.com/ '' ''
check_request 'HTTPS blog without slash' officesdk.com /blog https 200 '' text/html BLOG_FIXTURE
if [[ "${NGINX_TEST_SMOKE_ONLY:-0}" != 1 ]]; then
  check_request 'Forwarded HTTP homepage' officesdk.com / http 301 https://officesdk.com/ '' ''
  check_request 'HTTPS homepage' officesdk.com / https 200 '' text/html HOME_FIXTURE
  check_request 'HTTPS article without slash' officesdk.com /blog/story https 200 '' text/html ARTICLE_FIXTURE
  check_request 'WWW homepage' www.officesdk.com / https 301 https://officesdk.com/ '' ''
  check_request 'WWW blog with query' www.officesdk.com '/blog?tag=Access%20control&page=2' https 301 'https://officesdk.com/blog?tag=Access%20control&page=2' '' ''
  check_request 'Blog slash with query' officesdk.com '/blog/?tag=Access%20control&page=2' https 301 'https://officesdk.com/blog?tag=Access%20control&page=2' '' ''
  check_request 'Article slash' officesdk.com /blog/story/ https 301 https://officesdk.com/blog/story '' ''
  check_request 'Homepage index alias' officesdk.com /index.html https 301 https://officesdk.com/ '' ''
  check_request 'Blog index alias with query' officesdk.com '/blog/index.html?tag=Access%20control&page=2' https 301 'https://officesdk.com/blog?tag=Access%20control&page=2' '' ''
  check_request 'Article index alias' officesdk.com /blog/story/index.html https 301 https://officesdk.com/blog/story '' ''
  check_request 'HTTPS blog query stays usable' officesdk.com '/blog?tag=Access%20control&page=2' https 200 '' text/html BLOG_FIXTURE
  check_request 'Unknown article' officesdk.com /blog/missing https 404 '' text/html NOT_FOUND_FIXTURE
  check_request 'Missing asset' officesdk.com /assets/missing.png https 404 '' text/html NOT_FOUND_FIXTURE
  check_request 'PNG asset' officesdk.com /assets/pixel.png https 200 '' image/png ''
  if ! cmp -s "$fixture_root/assets/pixel.png" "$test_dir/body"; then
    printf 'FAIL PNG asset: bytes differ from fixture\n'
    failures=$((failures + 1))
  fi
  check_request 'Sitemap XML' officesdk.com /sitemap.xml https 200 '' text/xml '<urlset'
  check_request 'Robots text' officesdk.com /robots.txt https 200 '' text/plain 'Sitemap: https://officesdk.com/sitemap.xml'
fi

printf '\nNginx routing: %s requests, %s failures. Temporary listener 127.0.0.1:%s will be removed.\n' "$checks" "$failures" "$port"
[[ "$failures" == 0 ]]
