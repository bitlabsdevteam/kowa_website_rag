# v4 Walkthrough

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`

## Validate landing page and trust entry points
1. Open `/`.
2. Confirm the page shows `Kowa Trade & Commerce`.
3. Confirm the top menu renders links for:
   - `Top Page`
   - `Welcome Note`
   - `Business Items`
   - `Inquiry`
   - `Gunma Store / Factory`
   - `Access`
   - `Legacy Data`
   - `Admin`
4. Confirm the page shows the `Company Profile` card and the `RAG Assistant` card.
5. Confirm the login control is visible in the top-right area.

## Validate migrated legacy menu destinations
Open each mapped destination and confirm the page heading and migrated badge copy render:

- `/welcome` -> `Welcome`
- `/business` -> `Business Items`
- `/inquiry` -> `Inquiry`
- `/factory` -> `Gunma Store / Factory`
- `/access` -> `Access`

Each page should display migrated content sourced from legacy excerpts rather than an empty placeholder.

## Validate legacy crawl coverage
1. Open `/legacy`.
2. Confirm the heading `Legacy Website Crawl Dataset` is visible.
3. Confirm at least one crawled source URL is listed, including `https://kowatrade.com/`.
4. Confirm each dataset card shows a title or URL plus an excerpt.

## Validate grounded chat behavior
1. On `/`, ask: `When was Kowa established?`
2. Expected: a grounded answer is returned and at least one source link is shown.
3. Ask: `Where is Kowa located?`
4. Expected: the assistant returns the address from available source content.
5. Ask an unsupported question.
6. Expected: `I don't know based on the available Kowa sources.`

## Validate ingestion API
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{"title":"FAQ","href":"https://example.com/faq","content":"Kowa handles polymer and trading inquiries."}'
```

Expected response:
- `"ok": true`
- a generated `id`
- incremented `totalSources`

Then ask the chatbot about `polymer and trading inquiries` and verify the answer is grounded to the ingested source.

## Validate auth entry point
1. Open `/login`.
2. Confirm the heading `Login` is visible.
3. Confirm `Email` and `Password` inputs render.
4. If Supabase credentials are configured, test successful sign-in and redirect back to `/`.

## Known gap
The top menu currently includes `/admin`, but no `app/admin` route exists in this repo. Treat that link as an open implementation gap rather than a release-ready admin surface.

## Build and E2E validation
```bash
npm run build
npx playwright test
```
