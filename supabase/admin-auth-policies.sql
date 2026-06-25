-- Run this once on the existing GRUZIN Supabase project after creating an admin Auth user.
-- It keeps guest menu reading public, but blocks anonymous edits from the browser.

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
on public.menu_items for select
to anon, authenticated
using (true);

drop policy if exists "Anon can manage categories temporarily" on public.categories;
drop policy if exists "Authenticated admins can manage categories" on public.categories;
create policy "Authenticated admins can manage categories"
on public.categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Anon can manage menu items temporarily" on public.menu_items;
drop policy if exists "Authenticated admins can manage menu items" on public.menu_items;
create policy "Authenticated admins can manage menu items"
on public.menu_items for all
to authenticated
using (true)
with check (true);
