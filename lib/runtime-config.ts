const REQUIRED_RUNTIME_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'DIFY_API_KEY', 'DIFY_BASE_URL'] as const;

export type RuntimeEnvKey = (typeof REQUIRED_RUNTIME_ENV)[number];

export function getRuntimeEnvStatus() {
  const missing = REQUIRED_RUNTIME_ENV.filter((key) => !process.env[key]);

  return {
    required: [...REQUIRED_RUNTIME_ENV],
    missing,
    valid: missing.length === 0,
  };
}

export function assertRuntimeEnvForProduction() {
  if (process.env.NODE_ENV !== 'production') return;

  const { missing } = getRuntimeEnvStatus();
  if (missing.length === 0) return;

  throw new Error(`Missing required runtime environment variables: ${missing.join(', ')}`);
}

