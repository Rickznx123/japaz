create policy "public can read media metadata" on public.media for select using (true);

-- Allow public pages to resolve branding references stored in site_settings.
drop policy if exists "public read landing settings" on public.site_settings;
create policy "public read landing settings" on public.site_settings for select using (key like 'landing.%' or key = 'footer' or key like 'branding.%');
