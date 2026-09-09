create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  url text not null,
  alt_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.festivals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  full_description text not null default '',
  price numeric(10,2) not null default 0 check (price >= 0),
  price_label text not null default 'por pessoa',
  image_url text,
  secondary_image_url text,
  active boolean not null default true,
  display_order integer not null default 0,
  schedule jsonb not null default '[]'::jsonb,
  children_info jsonb not null default '[]'::jsonb,
  rules jsonb not null default '[]'::jsonb,
  observations text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.festival_categories (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(festival_id, name)
);

create table if not exists public.festival_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.festival_categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  image_url text,
  subitems jsonb not null default '[]'::jsonb,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists festival_categories_festival_order on public.festival_categories(festival_id, display_order);
create index if not exists festival_items_category_order on public.festival_items(category_id, display_order);

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;
alter table public.festivals enable row level security;
alter table public.festival_categories enable row level security;
alter table public.festival_items enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid() and role in ('admin', 'editor'));
$$;

create policy "public can read active festivals" on public.festivals for select using (active = true or public.is_admin());
create policy "public can read active categories" on public.festival_categories for select using ((active = true and exists (select 1 from public.festivals f where f.id = festival_id and f.active)) or public.is_admin());
create policy "public can read active items" on public.festival_items for select using ((active = true and exists (select 1 from public.festival_categories c join public.festivals f on f.id = c.festival_id where c.id = category_id and c.active and f.active)) or public.is_admin());
create policy "admins manage festivals" on public.festivals for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.festival_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage items" on public.festival_items for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read settings" on public.site_settings for select using (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "public read landing settings" on public.site_settings for select using (key like 'landing.%' or key = 'footer');
create policy "admins manage media" on public.media for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('japaz-media', 'japaz-media', true) on conflict (id) do nothing;
create policy "public can view Japaz media" on storage.objects for select using (bucket_id = 'japaz-media');
create policy "admins upload Japaz media" on storage.objects for insert with check (bucket_id = 'japaz-media' and public.is_admin());
create policy "admins update Japaz media" on storage.objects for update using (bucket_id = 'japaz-media' and public.is_admin());
create policy "admins delete Japaz media" on storage.objects for delete using (bucket_id = 'japaz-media' and public.is_admin());

insert into public.site_settings (key, value) values
('landing.hero', '{"logo":"JAPAZ SUSHI","title":"FESTIVAIS","subtitle":"Três experiências. Um só sabor.","description":"Escolha seu festival e descubra uma nova forma de viver o sushi.","button":"VER FESTIVAIS","image":"","secondaryImage":"","decorativeImage":""}'),
('landing.festivals', '{"title":"Três formas de celebrar.","subtitle":"Escolha sua experiência","description":"Uma seleção pensada para cada momento. Feita para ser compartilhada."}'),
('landing.updated', '{"title":"PREÇOS ATUALIZADOS","description":"Nosso cardápio é digital e pode ser atualizado sempre que necessário.","complement":"Consulte sempre a versão mais recente."}'),
('footer', '{"company":"JAPAZ SUSHI","primary":"TRADIÇÃO JAPONESA • SABOR EM CADA DETALHE","secondary":"São Paulo · Brasil","instagram":"","whatsapp":"","address":"","hours":"","copyright":"© Japaz Sushi"}')
on conflict (key) do nothing;

-- Seed the relational catalog from the official initial menu. Run only on an empty database.
insert into public.festivals (name, slug, description, price, display_order, schedule, children_info, rules)
values
('Festival Executivo','executivo','Uma experiência completa com entradas, sushi, sobremesas, bebidas e sucos.',109.99,1,'["Disponível no jantar","De terça a domingo"]','["0 a 5 anos: isentos","5 a 10 anos: 30% de desconto","A partir de 11 anos: valor integral"]','["O festival é individual","Não compartilhável","Evite desperdício","Pratique o consumo consciente"]'),
('Festival Salmão','salmao','Uma seleção especial para quem ama salmão, com sushi, entradas, sobremesas, bebidas e drinks.',139.99,2,'["Disponível no jantar","De terça a domingo"]','["0 a 5 anos: isentos","5 a 10 anos: 30% de desconto","A partir de 11 anos: valor integral"]','["O festival é individual","Não compartilhável","Evite desperdício","Pratique o consumo consciente"]'),
('Festival Prime','prime','A experiência mais completa do Japaz, com ampla variedade de entradas, sushi, sobremesas, bebidas, sucos e drinks.',169.99,3,'["Disponível no jantar","De terça a domingo"]','["0 a 5 anos: isentos","5 a 10 anos: 30% de desconto","A partir de 11 anos: valor integral"]','["O festival é individual","Não compartilhável","Evite desperdício","Pratique o consumo consciente"]')
on conflict (slug) do nothing;
