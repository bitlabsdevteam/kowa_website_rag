import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dockerfile = readFileSync(new URL('../../Dockerfile', import.meta.url), 'utf8');
const compose = readFileSync(new URL('../../docker-compose.yml', import.meta.url), 'utf8');
const envExample = readFileSync(new URL('../../.env.example', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');

test('docker runtime defines production entrypoint and app port', () => {
  assert.match(dockerfile, /EXPOSE\s+3000/);
  assert.match(dockerfile, /CMD\s+\["npm",\s*"run",\s*"start"\]/);
});

test('compose and env examples include required runtime integrations', () => {
  assert.match(compose, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(compose, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(compose, /DIFY_API_KEY/);
  assert.match(compose, /DIFY_BASE_URL/);

  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_URL=/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_ANON_KEY=/);
  assert.match(envExample, /DIFY_API_KEY=/);
  assert.match(envExample, /DIFY_BASE_URL=/);
});

test('readme documents container workflow and env requirements', () => {
  assert.match(readme, /docker compose up --build/);
  assert.match(readme, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(readme, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(readme, /DIFY_API_KEY/);
  assert.match(readme, /DIFY_BASE_URL/);
});
