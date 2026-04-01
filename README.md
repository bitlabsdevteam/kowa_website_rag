# kowa_website_rag

## Local development
```bash
npm install
npm run dev
```

## Docker
1. Copy `.env.example` to `.env` and set any needed public Supabase values.
2. Build and run:

```bash
docker compose up --build
```

The app will be exposed on `http://localhost:3000`.

## Required environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The UI can render without these values, but login/auth flows require them.
