import type { AssistantLanguage, TelegramOutboundMessage, TelegramWebhookResponse, TelegramWebhookUpdate } from '@/lib/assistant/types';
import { getAssistantSession, getTelegramChannelBinding, upsertTelegramChannelBinding } from '@/lib/assistant/store';
import { assertAssistantRateLimit, createAssistantSessionRecord, runAssistantTurn, validateAssistantPayload } from '@/lib/assistant/service';
import { deliverTelegramMessage } from '@/lib/telegram/client';
import { getTelegramRuntimeConfig } from '@/lib/runtime-config';

export const TELEGRAM_SECRET_HEADER = 'x-telegram-bot-api-secret-token';

function mapTelegramLanguage(languageCode?: string): AssistantLanguage {
  const normalized = languageCode?.toLowerCase() ?? '';
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('zh')) return 'zh';
  return 'en';
}

function formatTelegramReplyText(answer: string, recoveryGuidance?: string[]) {
  if (!recoveryGuidance?.length) return answer;
  return `${answer}\n\n${recoveryGuidance.join('\n')}`;
}

function parseTelegramTextUpdate(update: TelegramWebhookUpdate) {
  const message = update.message;
  if (!message?.text?.trim() || !message.from) {
    return null;
  }

  return {
    text: message.text.trim(),
    chatId: message.chat.id,
    userId: message.from.id,
    language: mapTelegramLanguage(message.from.language_code),
    username: message.from.username ?? null,
    firstName: message.from.first_name ?? null,
    lastName: message.from.last_name ?? null,
  };
}

function resolveTelegramSession(parsed: NonNullable<ReturnType<typeof parseTelegramTextUpdate>>) {
  const binding = getTelegramChannelBinding(parsed.userId, parsed.chatId);
  if (binding) {
    const session = getAssistantSession(binding.sessionId);
    if (session) {
      return {
        sessionId: binding.sessionId,
        conversationId: binding.conversationId,
        language: binding.language,
      };
    }
  }

  const session = createAssistantSessionRecord({
    locale: parsed.language,
    entryPage: '/telegram',
    channel: 'telegram',
    anonymousId: `telegram:${parsed.userId}`,
  });

  return {
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    language: session.language,
  };
}

export function isAuthorizedTelegramWebhookRequest(request: Request): boolean {
  const runtime = getTelegramRuntimeConfig();
  if (!runtime.secret) return true;
  return request.headers.get(TELEGRAM_SECRET_HEADER) === runtime.secret;
}

export async function handleTelegramWebhook(update: TelegramWebhookUpdate): Promise<TelegramWebhookResponse> {
  const parsed = parseTelegramTextUpdate(update);
  if (!parsed) {
    return {
      ok: true,
      ignored: true,
      route: '/api/telegram/webhook',
      delivery: 'skipped',
    };
  }

  const session = resolveTelegramSession(parsed);
  validateAssistantPayload({ message: parsed.text });
  assertAssistantRateLimit(`telegram:${parsed.userId}:${parsed.chatId}`);

  const assistant = await runAssistantTurn({
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    message: parsed.text,
    locale: parsed.language,
  });

  upsertTelegramChannelBinding({
    channel: 'telegram',
    telegramUserId: parsed.userId,
    telegramChatId: parsed.chatId,
    sessionId: assistant.sessionId,
    conversationId: assistant.conversationId,
    language: assistant.language,
    username: parsed.username,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
  });

  const reply: TelegramOutboundMessage = {
    method: 'sendMessage',
    chatId: parsed.chatId,
    text: formatTelegramReplyText(assistant.answer, assistant.recoveryGuidance),
  };

  const delivery = await deliverTelegramMessage(reply);

  return {
    ok: true,
    route: '/api/telegram/webhook',
    sessionId: assistant.sessionId,
    conversationId: assistant.conversationId,
    reply,
    delivery,
  };
}
