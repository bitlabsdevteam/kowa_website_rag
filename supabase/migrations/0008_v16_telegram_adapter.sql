create table if not exists public.telegram_channel_accounts (
  id uuid primary key default gen_random_uuid(),
  assistant_session_id uuid not null references public.assistant_sessions(id) on delete cascade,
  telegram_user_id bigint not null,
  telegram_chat_id bigint not null,
  username text,
  first_name text,
  last_name text,
  language_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (telegram_user_id, telegram_chat_id)
);

create index if not exists idx_telegram_channel_accounts_session on public.telegram_channel_accounts(assistant_session_id);
create index if not exists idx_telegram_channel_accounts_lookup on public.telegram_channel_accounts(telegram_user_id, telegram_chat_id);

drop trigger if exists trg_telegram_channel_accounts_updated_at on public.telegram_channel_accounts;
create trigger trg_telegram_channel_accounts_updated_at
before update on public.telegram_channel_accounts
for each row execute procedure public.set_updated_at();
