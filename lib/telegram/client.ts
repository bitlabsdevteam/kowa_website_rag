import type { TelegramOutboundMessage } from '@/lib/assistant/types';
import { getAssistantRuntimeConfig, getTelegramRuntimeConfig } from '@/lib/runtime-config';

export async function deliverTelegramMessage(message: TelegramOutboundMessage): Promise<'disabled' | 'sent' | 'skipped'> {
  const assistantRuntime = getAssistantRuntimeConfig();
  const telegramRuntime = getTelegramRuntimeConfig();

  if (!assistantRuntime.flags.telegramAdapterEnabled) {
    return 'disabled';
  }

  if (!assistantRuntime.flags.telegramDeliveryEnabled || !telegramRuntime.botToken) {
    return 'skipped';
  }

  const response = await fetch(`${telegramRuntime.baseUrl}/bot${telegramRuntime.botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: message.chatId,
      text: message.text,
    }),
  });

  if (!response.ok) {
    throw new Error('telegram delivery failed');
  }

  return 'sent';
}
