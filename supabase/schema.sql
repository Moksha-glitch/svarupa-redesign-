-- SVARUPA — PostgreSQL / Supabase schema
-- Apply in the Supabase SQL editor, then enable Auth.
-- Local development uses Prisma + SQLite; this file is the production shape.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id text primary key,
  email text unique not null,
  password_hash text,
  name text,
  image text,
  email_verified timestamptz,
  google_id text unique,
  role text not null default 'user',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.user_preferences (
  id text primary key,
  user_id text unique not null references public.users(id) on delete cascade,
  ai_tone text not null default 'balanced',
  language text not null default 'en',
  philosophy_familiarity text not null default 'new',
  reasons text not null default '[]',
  explore_topics text not null default '[]',
  notifications_enabled boolean not null default true,
  notify_hour int not null default 20,
  theme text not null default 'system'
);

create table if not exists public.journal_entries (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  date timestamptz not null default now(),
  how_i_arrived text,
  what_happened text,
  what_i_felt text,
  what_i_noticed text,
  what_i_want_to_remember text,
  free_write text,
  favorite boolean not null default false,
  emotion_tags text not null default '[]',
  source text not null default 'journal',
  sit_question text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reflection_sessions (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  title text,
  status text not null default 'active',
  excerpt text,
  state text not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reflection_messages (
  id text primary key,
  session_id text not null references public.reflection_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  chips text,
  kind text not null default 'text',
  meta text,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;
alter table public.reflection_sessions enable row level security;
alter table public.reflection_messages enable row level security;
alter table public.user_preferences enable row level security;

create policy "own journal" on public.journal_entries
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

create policy "own reflections" on public.reflection_sessions
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

create policy "own reflection messages" on public.reflection_messages
  for all using (
    exists (select 1 from public.reflection_sessions s where s.id = session_id and s.user_id = auth.uid()::text)
  );

create policy "own preferences" on public.user_preferences
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- Public wisdom tables remain readable; mutations are service-role / admin only.
