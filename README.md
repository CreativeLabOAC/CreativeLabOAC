# vinext-starter

## Updating approved content

`app/content.ts` contains bilingual research, project, people and biography text.
`app/resources.ts` contains approved resource links, DOI records, podcast episodes
and events. Missing CV, Scholar, email and podcast links remain explicit empty
values: add approved values there rather than inserting guessed addresses.
Events and episodes require both English and Hebrew text. Google Docs can be used
as an editorial source; updates are copied into these records and reviewed before
publication. There is no automatic Google Docs synchronization.

## Moving to a custom domain

Add the purchased domain under repository Settings → Pages and configure the DNS
records GitHub provides. The deployment workflow reads the Pages URL and derives
the asset base path automatically: a custom domain uses an empty base path, while
the repository URL uses `/CreativeLabOAC`. Trigger the workflow again after the
domain is configured. No application rewrite is needed. For another static host,
build with `GITHUB_PAGES=true`, `NEXT_PUBLIC_BASE_PATH` set to the host path (empty
for a root domain), and `NEXT_PUBLIC_SITE_URL` set to the full public URL. Deploy
the `out` directory. Domain purchase and DNS configuration are separate steps.

Validate the static build with `node --test tests/pages-export.test.mjs`.

## GitHub Pages

The `Deploy GitHub Pages` workflow builds a static Next.js export and publishes
it on pushes to `main`. The repository owner must first select **GitHub Actions**
under **Settings → Pages → Build and deployment → Source**.

The intended URL is https://creativelaboac.github.io/CreativeLabOAC/.
Hash routes, language switching, and the browser-local questionnaire work without
a server. Cloudflare and ChatGPT server integrations are not part of this export.

To validate the export in PowerShell:

```powershell
$env:GITHUB_PAGES = "true"
$env:NEXT_PUBLIC_BASE_PATH = "/CreativeLabOAC"
npm run build:pages
```

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
