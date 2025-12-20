#!/usr/bin/env bash
set -euo pipefail

# Safe Playwright installer helper
# - If Arch-based OS detected, print required pacman command and exit (doesn't auto-run pacman)
# - Otherwise, runs `npx playwright install` to download browser binaries

OS_ID="$(. /etc/os-release && echo "$ID" 2>/dev/null || echo unknown)"

echo "Detected OS: $OS_ID"

if [[ "$OS_ID" =~ ^(arch|archlinux|omarchy)$ ]]; then
  cat <<'EOF'
Playwright on Arch/Omarchy requires system dependencies installed via pacman.
Run (as root or with sudo):

sudo pacman -S --needed \
    nss nspr freetype2 expat cairo libx11 libxcb dbus \
    libdrm mesa libxcomposite libxdamage libxrandr libgbm \
    pango alsa-lib libxshmfence libxfixes libxkbcommon \
    at-spi2-core wayland-protocols \
    gstreamer gst-plugins-base gst-plugins-good gst-plugins-bad \
    enchant libsecret libwebp libxslt libwoff2 woff2 \
    harfbuzz-icu hyphen

After installing system deps, run:

npx playwright install

Note: This script does NOT run pacman; run the above command manually.
EOF
  exit 64
fi

# Non-Arch: run Playwright installer to fetch browser binaries
echo "Running: npx playwright install"
if npx playwright install; then
  echo "Playwright browsers downloaded successfully."
  exit 0
else
  echo "Playwright install failed. Check system dependencies. See refs/playwright_with_playbook_ref.txt for Arch instructions." >&2
  exit 1
fi
