import { expect, test } from '@playwright/test';

type TelegramWebhookResponse = {
  ok: boolean;
  ignored?: boolean;
  sessionId?: string;
  conversationId?: string;
  reply?: {
    method: 'sendMessage';
    chatId: number;
    text: string;
  };
};

test('v16 task4: telegram webhook returns a normalized reply payload for text messages', async ({ request }) => {
  const res = await request.post('/api/telegram/webhook', {
    data: {
      update_id: 2001,
      message: {
        message_id: 91,
        date: 1710000000,
        text: 'What does Kowa do?',
        chat: { id: 445566, type: 'private' },
        from: { id: 778899, is_bot: false, first_name: 'Aya', language_code: 'en' },
      },
    },
  });

  expect(res.ok()).toBeTruthy();
  const payload = (await res.json()) as TelegramWebhookResponse;

  expect(payload.ok).toBeTruthy();
  expect(payload.ignored).not.toBeTruthy();
  expect(payload.sessionId).toBeTruthy();
  expect(payload.conversationId).toBeTruthy();
  expect(payload.reply?.method).toBe('sendMessage');
  expect(payload.reply?.chatId).toBe(445566);
  expect(payload.reply?.text.length).toBeGreaterThan(0);
});

test('v16 task4: telegram webhook resumes the same assistant session for the same telegram user and chat', async ({ request }) => {
  const first = await request.post('/api/telegram/webhook', {
    data: {
      update_id: 2002,
      message: {
        message_id: 92,
        date: 1710000001,
        text: 'Where is Kowa located?',
        chat: { id: 12345, type: 'private' },
        from: { id: 777, is_bot: false, first_name: 'Taro', language_code: 'ja' },
      },
    },
  });
  expect(first.ok()).toBeTruthy();
  const firstPayload = (await first.json()) as TelegramWebhookResponse;

  const second = await request.post('/api/telegram/webhook', {
    data: {
      update_id: 2003,
      message: {
        message_id: 93,
        date: 1710000002,
        text: 'And the phone number?',
        chat: { id: 12345, type: 'private' },
        from: { id: 777, is_bot: false, first_name: 'Taro', language_code: 'ja' },
      },
    },
  });
  expect(second.ok()).toBeTruthy();
  const secondPayload = (await second.json()) as TelegramWebhookResponse;

  expect(secondPayload.sessionId).toBe(firstPayload.sessionId);
  expect(secondPayload.conversationId).toBe(firstPayload.conversationId);
  expect(secondPayload.reply?.chatId).toBe(12345);
});

test('v16 task4: telegram webhook safely ignores unsupported updates', async ({ request }) => {
  const res = await request.post('/api/telegram/webhook', {
    data: {
      update_id: 2004,
      callback_query: {
        id: 'cbq-1',
      },
    },
  });

  expect(res.ok()).toBeTruthy();
  const payload = (await res.json()) as TelegramWebhookResponse;
  expect(payload.ok).toBeTruthy();
  expect(payload.ignored).toBeTruthy();
});
