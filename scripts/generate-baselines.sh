#!/usr/bin/env bash
set -euo pipefail

echo "📸 Generating visual regression baselines..."

# Ensure Storybook is running
if ! curl -s http://localhost:6006 > /dev/null; then
    echo "⚠️  Starting Storybook..."
    npm run storybook &
    STORYBOOK_PID=$!
    sleep 10
else
    echo "✓ Storybook already running"
    STORYBOOK_PID=""
fi

# Generate baselines
UPDATE_SNAPSHOTS=1 ./scripts/playwright-docker.sh

# Cleanup
if [ -n "${STORYBOOK_PID}" ]; then
    kill $STORYBOOK_PID || true
fi

echo "✓ Baselines generated in ui/e2e/baselines/"
echo "📝 Review changes and commit: npm run baselines:commit"
