#!/usr/bin/env bash
set -euo pipefail

source_release="$1"
target_release="$2"

# Old edge-cached HTML and open browser tabs still request these hashed URLs.
# Copy only missing build assets; never carry forward HTML or stable public files.
if [ -d "$source_release/_astro" ]; then
  mkdir -p "$target_release/_astro"
  while IFS= read -r -d '' asset; do
    relative_path="${asset#"$source_release/_astro/"}"
    destination="$target_release/_astro/$relative_path"
    if [ ! -e "$destination" ]; then
      mkdir -p "$(dirname "$destination")"
      cp -p "$asset" "$destination"
    fi
  done < <(find "$source_release/_astro" -type f -print0)
fi
