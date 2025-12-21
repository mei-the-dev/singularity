# UX Development Lifecycle Setup

## Prerequisites
- Node.js 20+
- Docker 24+ (recommended for Playwright)
- Git 2.40+

## Installation

Install dependencies:

npm install

Setup Playwright (Docker or local):

npm run playwright:install
or
./scripts/setup-playwright.sh

Build Storybook:

npm run storybook:build

## Starting Development

Start all services (Storybook + Next.js):

npm run dev:all

Or individually:

npm run storybook    # Port 6006
npm run dev          # Port 3000

## Running Visual Tests

Run tests locally:

npm run test:visual

Run in Docker (recommended):

npm run test:visual:docker

Update baselines:

npm run test:visual:docker:update

## Troubleshooting

Storybook won't start:

rm -rf node_modules/.cache/storybook
npm run storybook

Visual tests failing:

Check Storybook health:

curl http://localhost:6006/index.json

Regenerate baselines:

npm run baselines:generate
