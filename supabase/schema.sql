-- GRUZIN NFC menu Supabase schema
-- Run this in Supabase SQL Editor before adding VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
--
-- Important security note:
-- This project currently has no admin authentication, so the write policies below allow the
-- anonymous frontend key to manage menu data. That matches the current app behavior and lets the
-- admin panel work immediately, but before production you should add admin auth and replace the
-- write policies with authenticated/admin-only policies.

create table if not exists public.categories (
  id text primary key,
  name_ru text not null,
  name_uz text,
  name_en text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  name_ru text not null,
  name_uz text,
  name_en text,
  description_ru text,
  description_uz text,
  description_en text,
  price integer not null check (price >= 0),
  weight text,
  image_url text,
  is_available boolean not null default true,
  is_new boolean not null default false,
  is_popular boolean not null default false,
  is_seasonal boolean not null default false,
  sort_order integer not null default 0,
  needs_verification boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_sort_order_idx on public.categories(sort_order);
create index if not exists menu_items_category_sort_idx on public.menu_items(category_id, sort_order);
create index if not exists menu_items_available_idx on public.menu_items(is_available);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon
using (true);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
on public.menu_items for select
to anon
using (true);

drop policy if exists "Anon can manage categories temporarily" on public.categories;
create policy "Anon can manage categories temporarily"
on public.categories for all
to anon
using (true)
with check (true);

drop policy if exists "Anon can manage menu items temporarily" on public.menu_items;
create policy "Anon can manage menu items temporarily"
on public.menu_items for all
to anon
using (true)
with check (true);
