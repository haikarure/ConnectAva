#!/usr/bin/env bash
# Sync website/ (local dev) -> ConnectAva/ (git clone) then commit+push to origin.
# Skips node_modules, dist, .env, .git. Safe: never touches parent ai-avatar-yt.
set -euo pipefail

SRC=/home/haikaru/Archverse/Lab/ai-avatar-yt/website
DST=/home/haikaru/Archverse/Lab/ConnectAva
MSG="${1:-update: sync website to ConnectAva}"

cd "$DST"

# remove everything except .git and the sync script + node_modules/.env if any
find . -maxdepth 1 -mindepth 1 \
  -not -name '.git' -not -name '_sync_push.sh' \
  -not -name 'node_modules' -not -name '.env' \
  -exec rm -rf {} +

# copy website/ contents (excluding ignored dirs)
cd "$SRC"
find . -type f \
  -not -path './node_modules/*' \
  -not -path './dist/*' \
  -not -path './.git/*' \
  -not -name '.env' \
  -print0 | while IFS= read -r -d '' f; do
    mkdir -p "$DST/$(dirname "$f")"
    cp -f "$f" "$DST/$f"
done

cd "$DST"
# guarantee .env stays ignored
grep -qxF '.env' .gitignore 2>/dev/null || printf '\n.env\n' >> .gitignore

if git diff --quiet && git diff --cached --quiet; then
  echo "No changes to push."
  exit 0
fi

git add -A
git commit -q -m "$MSG"
git push origin main
echo "Pushed: $MSG"
