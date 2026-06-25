-- Permanent food image storage for GRUZIN menu photos.
-- Public read is allowed because customer menu cards need to display images.
-- Upload/update/delete require an authenticated Supabase admin session.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'food-images',
  'food-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read food images" on storage.objects;
create policy "Public can read food images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'food-images');

drop policy if exists "Authenticated admins can upload food images" on storage.objects;
create policy "Authenticated admins can upload food images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'food-images');

drop policy if exists "Authenticated admins can update food images" on storage.objects;
create policy "Authenticated admins can update food images"
on storage.objects for update
to authenticated
using (bucket_id = 'food-images')
with check (bucket_id = 'food-images');

drop policy if exists "Authenticated admins can delete food images" on storage.objects;
create policy "Authenticated admins can delete food images"
on storage.objects for delete
to authenticated
using (bucket_id = 'food-images');
