# Logo.dev brand search in the company/education logo modal

## Context

The logo modal in `app/Profile.tsx` already has a two-panel shell — left panel shows the current logo preview and an Upload Photo button, right panel is empty (`<div className="w-82 border-l ..." />` at line 771). We want the right panel to be a live brand-search picker powered by logo.dev: user types, sees autocomplete results with logos and domains, clicks one to assign it to the experience or education entry.

Why now: this removes the need for users to manually find and upload a logo image for each role/school, which was the friction point that drove the modal's existence in the first place.

## Key constraints from the logo.dev docs

These shape the design and aren't optional:

1. **Brand search requires a secret key, not a publishable key.** `GET https://api.logo.dev/search?q=...` takes `Authorization: Bearer sk_...` and the docs explicitly say the secret key must "never be exposed publicly" and must not be "seen from front-end code." → search must be proxied through a server-side route.
2. **Logo image endpoint is browser-safe** with a publishable key passed via `?token=pk_...`. URLs like `https://img.logo.dev/nike.com?token=pk_...&size=200&format=png` can be used directly in `<img>` tags. Cached 24h via `Cache-Control: public, max-age=86400`.
3. **Search response shape**: array of `{ name: string, domain: string }`, max 10 results, sorted by popularity.
4. **Attribution required on production**: `<a href="https://logo.dev">Logos provided by Logo.dev</a>` must be visible. Not enforced on localhost. Decision: put it inside the modal right panel.
5. **Rate limits**: no per-minute burst limits, only monthly request counts (Free tier = 500k/mo). Debouncing input is still polite and reduces noise.

## Implementation

### 1. Env vars (`.env.local`, gitignored)

```
LOGO_DEV_SECRET_KEY=sk_xxx              # server-only, never NEXT_PUBLIC
NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY=pk_xxx
```

User needs to obtain both from https://www.logo.dev/dashboard/api-keys before testing.

### 2. New server route: `app/api/logo-search/route.ts`

Next.js 16 Route Handler. **Per `AGENTS.md`, read `node_modules/next/dist/docs/` for the current Route Handler API before writing this file** — there may be breaking changes from what's in training data.

Behavior:
- Export `GET(request: Request)`.
- Read `q` from `new URL(request.url).searchParams`. If missing/empty, return `Response.json([], { status: 200 })`.
- Read `process.env.LOGO_DEV_SECRET_KEY`. If missing, return `Response.json({ error: "Server not configured" }, { status: 500 })` — do not leak which env var.
- Fetch `https://api.logo.dev/search?q={encoded}&strategy=typeahead` with `Authorization: Bearer ${secret}`.
- On non-2xx upstream, return `Response.json([], { status: 200 })` so the UI shows "no results" rather than a scary error for transient upstream issues. Log server-side.
- On 2xx, pass the JSON array through unchanged. Optionally add `Cache-Control: private, max-age=60` to dedupe identical typeahead queries within a session.

The secret key is never sent in the response.

### 3. Image-URL helper (top of `app/Profile.tsx`, near other constants)

```ts
const LOGO_DEV_PK = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY;
function logoDevImageUrl(domain: string, size = 200) {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_PK}&size=${size}&format=png`;
}
```

Use `size=40` for result-row thumbnails, `size=200` for what we save onto the entry.

### 4. Replace the empty right panel (`app/Profile.tsx` line 771)

Build the panel inline inside the existing modal — no new file. Layout:

```
┌─ right panel (w-82) ──────────────┐
│ [search input: "Search companies"]│
│ ─────────────────────────────────│
│ [logo] Name                      │
│        domain.com                │
│ [logo] Name                      │
│        domain.com                │
│ ... up to 10 results ...         │
│ ─────────────────────────────────│
│ Logos provided by Logo.dev       │
└──────────────────────────────────┘
```

State (lives in the existing `Profile` component, alongside `logoModal`):
- `searchQuery: string`
- `searchResults: { name: string; domain: string }[]`
- `searchStatus: "idle" | "loading" | "error"`

Behavior:
- 300ms debounce on `searchQuery` (use a `useEffect` with `setTimeout` and `clearTimeout` — no new dep, no new utility file).
- `AbortController` per fetch; abort the previous request on each new keystroke or when the modal closes.
- Empty/whitespace query → clear results, set status `idle`, don't fetch.
- Reset `searchQuery`, `searchResults`, status to `idle` when the modal opens or closes (key the right-panel state on `logoModal?.id`, or reset in the existing modal open/close handlers).
- On click of a result `{name, domain}`:
  - Compute `imageUrl = logoDevImageUrl(domain, 200)`.
  - If `logoModal.type === "experience"`: `updateExperience(logoModal.id, { logo: imageUrl, company: name })`.
  - Else: `updateEducation(logoModal.id, { logo: imageUrl, school: name })`.
  - Close the modal (`setLogoModal(null)`), matching the post-action behavior the user expects from "click to apply."

Render details:
- Result row: `<img src={logoDevImageUrl(domain, 40)} alt="" className="h-8 w-8 rounded-sm object-contain bg-white" />` then a 2-line text block (name bold, domain `text-xs text-[var(--li-text-secondary)]`).
- Result row is a `<button type="button" className="...hover:bg-zinc-100...">` for keyboard accessibility.
- Use `// eslint-disable-next-line @next/next/no-img-element` on the `<img>` tags (matches the existing pattern at line 741).
- Status text below the input: "Searching…" while loading, "No results" when `searchStatus === "idle"` and query is non-empty with empty results, nothing otherwise.
- Attribution at the bottom: `<a href="https://logo.dev" target="_blank" rel="noopener" className="text-xs text-[var(--li-text-secondary)] hover:underline">Logos provided by Logo.dev</a>` — note `rel="noopener"` only, **not** `noreferrer` (the docs require the referrer to pass through for attribution verification).

### Critical files

- `app/Profile.tsx` — replace the empty right pane at line 771; add helper + new state near the existing `logoModal` state (~line 218) and existing modal-related callbacks (`updateExperience` ~line 258, `handleLogoModalUpload` ~line 299).
- `app/api/logo-search/route.ts` — **new file**.
- `.env.local` — **new file** (gitignored).

No new component files, no new utilities directory — the project pattern is to keep everything inline in `Profile.tsx`.

## Verification

1. Add both keys to `.env.local`. Restart `npm run dev` (env changes require a restart).
2. Open the profile, click the logo icon on an experience entry to open the modal.
3. Type "nike" in the right-panel search → expect results within ~500ms, each showing a small logo + name + domain.
4. Click "Nike" → modal closes, the entry on the page now shows Nike's logo and "Nike" as the company name.
5. Re-open the modal on a different entry, type "harv" → expect Harvard etc. Click one → confirm the education entry updates `school` (not `company`).
6. Edge cases:
   - Clear the input → results disappear, no "No results" flash.
   - Type fast then stop → only one request fires per pause (debounce working). Watch Network tab.
   - Type a nonsense string → "No results" shows.
   - Temporarily blank `LOGO_DEV_SECRET_KEY` and restart → search shows error state gracefully; no secret leaked in network responses.
   - Confirm the attribution link is visible at the bottom of the right panel and opens https://logo.dev in a new tab.
7. View-source / Network tab: confirm `sk_` never appears in any client-visible payload. `pk_` appearing in `<img src>` URLs is expected and safe.
