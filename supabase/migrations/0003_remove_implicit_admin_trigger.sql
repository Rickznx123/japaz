drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Admin access is granted explicitly by inserting the user's UUID into admin_profiles.
