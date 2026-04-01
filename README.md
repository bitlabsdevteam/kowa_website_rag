# kowa_website_rag

## Local development
```bash
npm install
npm run dev
```

## Docker
1. Copy `.env.example` to `.env` and set required runtime values.
2. Build and run:

```bash
docker compose up --build
```

The app will be exposed on `http://localhost:3000`.
Use `docker compose down` to stop the stack.

## Required environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DIFY_API_KEY`
- `DIFY_BASE_URL`

The UI can render without full upstream integration values in development fallback mode, but production runtime expects these variables.

## Retrieval eval gate
Run the retrieval regression gate:

```bash
npm run eval:retrieval
```

The gate uses the versioned golden set at `data/evals/golden-queries.v1.json` and reports grounded/citation/correctness metrics with unanswered-cluster tracking.
