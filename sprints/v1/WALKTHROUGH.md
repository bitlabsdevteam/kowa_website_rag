# v1 Walkthrough

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`

## Validate migrated content
- Confirm company profile section displays normalized data from `sprints/v1/artifacts/content-normalized.json`.

## Validate RAG chatbot (grounded)
1. Ask: `What year was Kowa established?`
2. Expected: grounded answer with citation link to legacy source.
3. Ask unsupported question.
4. Expected abstention: `I don't know based on the available Kowa sources.`

## Validate ingestion API
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{"title":"FAQ","href":"https://example.com/faq","content":"Kowa handles polymer and trading inquiries."}'
```
Then ask chatbot about that content and verify retrieval.

## Build validation
```bash
npm run build
```
