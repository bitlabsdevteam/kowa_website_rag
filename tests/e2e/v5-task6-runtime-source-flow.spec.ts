import { expect, test } from '@playwright/test';

test('v5 task6 runtime health exposes environment validation status', async ({ request }) => {
  const res = await request.get('/api/runtime/health');
  expect(res.ok()).toBeTruthy();

  const payload = (await res.json()) as {
    mode: string;
    required: string[];
    missing: string[];
  };

  expect(payload.required).toContain('NEXT_PUBLIC_SUPABASE_URL');
  expect(payload.required).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  expect(payload.required).toContain('DIFY_API_KEY');
  expect(payload.required).toContain('DIFY_BASE_URL');
  expect(payload.mode.length).toBeGreaterThan(0);
});

test('v5 task6 ingest + chat uses persistent source repository flow', async ({ request }) => {
  const title = `Task6 source ${Date.now()}`;
  const href = 'https://kowatrade.com/productsindex2.html';
  const content = 'Kowa polymer bulletin for retrieval validation task6.';

  const ingest = await request.post('/api/ingest', {
    data: {
      title,
      href,
      content,
      tags: ['task6', 'persistent', 'source'],
    },
  });

  expect(ingest.ok()).toBeTruthy();

  const chat = await request.post('/api/chat', {
    data: {
      message: 'Where can I find the Kowa polymer bulletin for task6?',
    },
  });

  expect(chat.ok()).toBeTruthy();

  const payload = (await chat.json()) as {
    grounded: boolean;
    citations: Array<{ href: string; title: string }>;
  };

  expect(payload.grounded).toBeTruthy();
  expect(payload.citations.length).toBeGreaterThan(0);
  expect(payload.citations.some((citation) => citation.href === href && citation.title === title)).toBeTruthy();
});
