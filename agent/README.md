# Bekiuz AI Agent

This is the backend and admin foundation for the Bekiuz Company website.

## Architecture

- GitHub Pages keeps serving the public website.
- Cloudflare Worker runs the AI API.
- Workers AI model: \`@cf/google/gemma-4-26b-a4b-it\` (tool/function calling).
- Cloudflare D1 stores opted-in leads, internal tasks, quote drafts, and anonymous daily request counters.
- The public chat does not store the conversation transcript. It keeps chat history in the visitor's browser session.
- Lead capture is only enabled when the visitor checks the consent box in the chat widget.
- The admin API requires an 8-hour signed bearer token. Keep the admin password and session secret in Worker secrets, never in website files.

## 1. Create D1

From this directory:

\`\`\`powershell
npx.cmd wrangler d1 create bekiuz-company-agent
\`\`\`

Copy the returned database ID into \`wrangler.toml\` in place of \`REPLACE_WITH_D1_DATABASE_ID\`.

## 2. Apply the database schema

\`\`\`powershell
npx.cmd wrangler d1 migrations apply bekiuz-company-agent --remote
\`\`\`

## 3. Configure secrets

Create a long, unique admin password and a separate random session secret.

\`\`\`powershell
npx.cmd wrangler secret put ADMIN_PASSWORD
npx.cmd wrangler secret put SESSION_SECRET
\`\`\`

Optional Telegram lead notifications:

\`\`\`powershell
npx.cmd wrangler secret put TELEGRAM_BOT_TOKEN
npx.cmd wrangler secret put TELEGRAM_CHAT_ID
\`\`\`

Set Worker variables in the Cloudflare dashboard or add them under \`[vars]\`:

- \`ALLOWED_ORIGINS\`: \`https://bekiuz.github.io,https://bekiuz.company,https://www.bekiuz.company\`
- Do not put secrets in \`[vars]\`.

## 4. Deploy

\`\`\`powershell
npx.cmd wrangler deploy
\`\`\`

Cloudflare prints a \`workers.dev\` URL. Copy that URL into the \`API_URL\` constant in \`agent-widget.js\` and \`admin.html\`.

## 5. Run locally

\`\`\`powershell
npx.cmd wrangler dev
\`\`\`

## API overview

Public:
- \`POST /api/chat\` — AI client assistant.
- \`GET /api/health\` — health check.

Admin (requires \`Authorization: Bearer <token>\`):
- \`POST /api/admin/login\`
- \`GET /api/admin/summary\`
- \`GET /api/admin/leads\`
- \`GET /api/admin/tasks\`
- \`PATCH /api/admin/leads/:id\`
- \`PATCH /api/admin/tasks/:id\`
- \`POST /api/admin/chat\` — internal Operations Agent.

Internal AI tools can create tasks, complete tasks, update lead statuses, list leads/tasks, generate a quote draft, and summarize CRM counts. Quotes are drafts only; the Worker does not send them to clients.

## Important

The repository branch contains a starter implementation. It is not live until a D1 database is created, Worker secrets are configured, the Worker is deployed, and the website's API URL is set. Never commit API tokens, bot tokens, admin passwords, or session secrets.