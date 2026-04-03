alter table public.admin_handoff_queue
  add column if not exists assigned_to text,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.admin_handoff_notes (
  id uuid primary key default gen_random_uuid(),
  handoff_queue_id uuid not null references public.admin_handoff_queue(id) on delete cascade,
  author text not null default 'office-admin',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_handoff_queue_assigned on public.admin_handoff_queue(assigned_to, updated_at desc);
create index if not exists idx_admin_handoff_notes_queue on public.admin_handoff_notes(handoff_queue_id, created_at desc);
