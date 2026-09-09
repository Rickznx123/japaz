alter table public.media add column if not exists media_type text not null default 'uncategorized' check (media_type in ('branding', 'landing', 'festival', 'item', 'uncategorized'));
alter table public.media add column if not exists file_size integer;
alter table public.media add column if not exists mime_type text;
alter table public.media add column if not exists context_key text;
alter table public.media add column if not exists updated_at timestamptz not null default now();

alter table public.festivals add column if not exists cover_media_id uuid references public.media(id) on delete set null;
alter table public.festival_items add column if not exists media_id uuid references public.media(id) on delete set null;

create table if not exists public.festival_images (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  media_id uuid not null references public.media(id) on delete cascade,
  title text not null default '',
  description text not null default '',
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(festival_id, media_id)
);

create index if not exists media_context_idx on public.media(media_type, context_key);
create index if not exists festival_images_festival_order on public.festival_images(festival_id, display_order);

alter table public.festival_images enable row level security;
create policy "public can read active festival images" on public.festival_images for select using (active = true and exists (select 1 from public.festivals f where f.id = festival_id and f.active) or public.is_admin());
create policy "admins manage festival images" on public.festival_images for all using (public.is_admin()) with check (public.is_admin());

-- Keep the current URL-based catalog working while new contextual references are added.
-- Existing media rows can be linked manually by the admin without copying Storage files.
