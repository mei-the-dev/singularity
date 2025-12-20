Start-dev helper

Use `npm run start-dev` or the agent `/start-dev` starter to start a full development session. This performs the following steps (best-effort):

- Starts `docker compose up -d` if Docker is available
- Starts Storybook (port 6006)
- Starts the app (Next dev server, port 3000)
- Ensures Playwright dependencies are installed or available via Docker (preferred). If Docker is available, Playwright tests run inside the Playwright container so browsers need not be installed locally.

Why:
- Ensures Storybook is always available on port 6006 for MCP discovery and Playwright tests
- Avoids ad-hoc `sleep && curl` polling; the helper validates ports using TCP checks and returns a structured health summary.

If the helper cannot bring up services, it still writes `./.task-context/services.json` with the health details for debugging.
