const REQUIRED_RUNTIME_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'DIFY_API_KEY', 'DIFY_BASE_URL'] as const;

export type RuntimeEnvKey = (typeof REQUIRED_RUNTIME_ENV)[number];

const DEFAULT_ASSISTANT_RUNTIME = {
  flags: {
    publicAssistantEnabled: true,
    handoffEnabled: true,
    adminInboxEnabled: true,
  },
  limits: {
    maxMessageChars: 500,
    maxNoteChars: 500,
    maxRequestsPerMinute: 12,
  },
} as const;

export function getRuntimeEnvStatus() {
  const missing = REQUIRED_RUNTIME_ENV.filter((key) => !process.env[key]);

  return {
    required: [...REQUIRED_RUNTIME_ENV],
    missing,
    valid: missing.length === 0,
  };
}

export function getAssistantRuntimeConfig() {
  return {
    flags: {
      publicAssistantEnabled: process.env.KOWA_ASSISTANT_PUBLIC_ENABLED !== 'false' ? DEFAULT_ASSISTANT_RUNTIME.flags.publicAssistantEnabled : false,
      handoffEnabled: process.env.KOWA_ASSISTANT_HANDOFF_ENABLED !== 'false' ? DEFAULT_ASSISTANT_RUNTIME.flags.handoffEnabled : false,
      adminInboxEnabled: process.env.KOWA_ASSISTANT_ADMIN_INBOX_ENABLED !== 'false' ? DEFAULT_ASSISTANT_RUNTIME.flags.adminInboxEnabled : false,
    },
    limits: {
      maxMessageChars: Number(process.env.KOWA_ASSISTANT_MAX_MESSAGE_CHARS ?? DEFAULT_ASSISTANT_RUNTIME.limits.maxMessageChars),
      maxNoteChars: Number(process.env.KOWA_ASSISTANT_MAX_NOTE_CHARS ?? DEFAULT_ASSISTANT_RUNTIME.limits.maxNoteChars),
      maxRequestsPerMinute: Number(process.env.KOWA_ASSISTANT_MAX_REQUESTS_PER_MINUTE ?? DEFAULT_ASSISTANT_RUNTIME.limits.maxRequestsPerMinute),
    },
  };
}

export function assertRuntimeEnvForProduction() {
  if (process.env.NODE_ENV !== 'production') return;

  const { missing } = getRuntimeEnvStatus();
  if (missing.length === 0) return;

  throw new Error(`Missing required runtime environment variables: ${missing.join(', ')}`);
}
