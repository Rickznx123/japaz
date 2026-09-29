with source_media (file_name, storage_path, url) as (
  values
    ('Japaz hero - sushi.jpg', 'external/unsplash/photo-1579584425555-c3ce17fd4351', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=85'),
    ('Japaz hero - ramen.jpg', 'external/unsplash/photo-1569718212165-3a8278d5f624', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=85')
), registered_media as (
  insert into public.media (file_name, storage_path, url, media_type, context_key, mime_type)
  select file_name, storage_path, url, 'landing', 'site/landing/hero', 'image/jpeg'
  from source_media
  on conflict (storage_path) do update
    set url = excluded.url,
        media_type = excluded.media_type,
        context_key = excluded.context_key,
        mime_type = excluded.mime_type
  returning id, storage_path
)
update public.site_settings
set value = jsonb_set(
  jsonb_set(
    coalesce(value, '{}'::jsonb),
    '{imageMediaId}',
    to_jsonb((select id::text from registered_media where storage_path = 'external/unsplash/photo-1579584425555-c3ce17fd4351')),
    true
  ),
  '{secondaryImageMediaId}',
  to_jsonb((select id::text from registered_media where storage_path = 'external/unsplash/photo-1569718212165-3a8278d5f624')),
  true
)
where key = 'landing.hero';