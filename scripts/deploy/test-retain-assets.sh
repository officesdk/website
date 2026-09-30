#!/usr/bin/env bash
# Cached HTML and open tabs must keep working after activation and rollback.
set -euo pipefail
script_dir="$(cd "$(dirname "$0")" && pwd)"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT
mkdir -p "$fixture"/{first,second,third}/_astro
printf 'old CSS' > "$fixture/first/_astro/old.hash.css"
printf 'old HTML' > "$fixture/first/index.html"
printf 'new CSS' > "$fixture/second/_astro/new.hash.css"
printf 'new HTML' > "$fixture/second/index.html"

bash "$script_dir/retain-assets.sh" "$fixture/first" "$fixture/second"
test -f "$fixture/second/_astro/old.hash.css" || { echo 'FAIL: cached HTML loses its old CSS after activation'; exit 1; }
test "$(cat "$fixture/second/index.html")" = 'new HTML'
test "$(cat "$fixture/second/_astro/new.hash.css")" = 'new CSS'

# Repeated releases preserve resources transitively, including nested imports.
mkdir -p "$fixture/second/_astro/nested"
printf 'module' > "$fixture/second/_astro/nested/module.hash.js"
bash "$script_dir/retain-assets.sh" "$fixture/second" "$fixture/third"
test "$(cat "$fixture/third/_astro/old.hash.css")" = 'old CSS'
test "$(cat "$fixture/third/_astro/nested/module.hash.js")" = 'module'
test ! -e "$fixture/third/index.html"

# Retrying must never replace an asset already present in the target.
printf 'target bytes' > "$fixture/third/_astro/new.hash.css"
bash "$script_dir/retain-assets.sh" "$fixture/second" "$fixture/third"
test "$(cat "$fixture/third/_astro/new.hash.css")" = 'target bytes'

# Rollback must also support HTML already cached from the newer release.
bash "$script_dir/retain-assets.sh" "$fixture/second" "$fixture/first"
test "$(cat "$fixture/first/_astro/new.hash.css")" = 'new CSS'
test "$(cat "$fixture/first/index.html")" = 'old HTML'
bash "$script_dir/retain-assets.sh" "$fixture/no-previous-release" "$fixture/first"
echo 'PASS: activation, consecutive releases, retry, rollback, and first deployment'
