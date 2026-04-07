do $$
begin
  if not exists (select 1 from pg_type where typname = 'handoff_status') then
    create type handoff_status as enum ('new', 'confirmed', 'triaged', 'assigned', 'resolved', 'dismissed');
  end if;
end
$$;

create table if not exists public.admin_handoff_queue (
  id uuid primary key default gen_random_uuid(),
  assistant_session_id uuid not null references public.assistant_sessions(id) on delete cascade,
  conversation_id uuid references public.rag_conversations(id) on delete set null,
  status handoff_status not null default 'new',
  intent_type assistant_intent not null,
  visitor_profile jsonb not null default '{}'::jsonb,
  summary_en text not null,
  summary_original text not null,
  requested_action text not null,
  transcript_preview jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists idx_admin_handoff_queue_status on public.admin_handoff_queue(status, created_at desc);
create index if not exists idx_admin_handoff_queue_session on public.admin_handoff_queue(assistant_session_id, created_at desc);
