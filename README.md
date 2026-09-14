# ete demo: todo app

A tiny task list used to demo [ete](https://github.com/kzfsg/ete): agent-recorded, deterministically replayed E2E tests.

- `server.mjs` serves the app on port 4321 with an in-memory API.
- `e2e/` holds the recorded user flows; `e2e/.resolved/` holds their exact browser actions.
- `.github/workflows/ete.yml` replays them on every PR and posts a results comment.

Run locally: `node server.mjs`, then `npx ete run`.
