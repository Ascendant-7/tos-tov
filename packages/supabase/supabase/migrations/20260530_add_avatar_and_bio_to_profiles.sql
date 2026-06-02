-- Add avatar_url and bio to profiles table
alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists bio text;
