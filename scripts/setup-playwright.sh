#!/usr/bin/env bash
set -euo pipefail

echo "🎭 Setting up Playwright..."

if command -v docker &> /dev/null; then
  echo "✓ Docker detected - pulling Playwright image..."
  docker pull mcr.microsoft.com/playwright:v1.57.0-jammy || true
  echo "✓ Docker image ready"
else
  echo "⚠️  Docker not found - installing Playwright locally..."
  npx playwright install --with-deps chromium
  echo "✓ Playwright installed locally"
fi

echo "✓ Playwright setup complete"
