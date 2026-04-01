import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('v9 task3 docker runner copies public static assets', () => {
  const dockerfile = readFileSync('Dockerfile', 'utf8');

  assert.equal(
    dockerfile.includes('COPY --from=builder /app/public ./public'),
    true,
    'Dockerfile runner stage must copy /app/public into ./public',
  );
});
