import { expect, test } from '@playwright/test';

test('v15 task4: runtime health exposes assistant config and analytics', async ({ request }) => {
  const res = await request.get('/api/runtime/health');
  expect(res.ok()).toBeTruthy();

  const payload = (await res.json()) as {
    assistant: { flags: Record<string, boolean>; limits: Record<string, number> };
    analytics: Record<string, number>;
  };

  expect(payload.assistant.flags.publicAssistantEnabled).toBeTruthy();
  expect(payload.assistant.flags.handoffEnabled).toBeTruthy();
  expect(payload.assistant.limits.maxMessageChars).toBeGreaterThan(0);
  expect(payload.assistant.limits.maxRequestsPerMinute).toBeGreaterThan(0);
  expect(typeof payload.analytics.sessionsCreated).toBe('number');
});

test('v15 task4: assistant turn route rejects burst traffic for one session', async ({ request }) => {
  const sessionRes = await request.post('/api/assistant/session', {
    data: { locale: 'en', entryPage: '/' },
  });
  expect(sessionRes.ok()).toBeTruthy();
  const session = (await sessionRes.json()) as { sessionId: string; conversationId: string };

  let limited = false;
  for (let index = 0; index < 13; index += 1) {
    const res = await request.post('/api/assistant/turn', {
      data: {
        sessionId: session.sessionId,
        conversationId: session.conversationId,
        message: `Rate limit probe ${index}`,
      },
    });

    if (!res.ok()) {
      const payload = (await res.json()) as { error?: string };
      expect(payload.error).toContain('rate limit exceeded');
      limited = true;
      break;
    }
  }

  expect(limited).toBeTruthy();
});
