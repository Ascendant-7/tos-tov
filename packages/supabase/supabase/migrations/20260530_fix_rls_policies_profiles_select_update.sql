-- =========================================
-- Migration: Fix/Complete RLS Policies for Profiles
-- Description: Restrict profile read/update to the owning user
-- Date: 2026-05-30
-- =========================================

-- Ensure RLS is enabled
alter table profiles enable row level security;

-- Replace overly-permissive select policy (if it exists)
drop policy if exists "Allow authenticated select on profiles" on profiles;
create policy "Allow authenticated select on profiles"
on profiles
for select
to authenticated
using (auth.uid() = id);

-- Allow authenticated users to update their own profile
drop policy if exists "Allow authenticated update on profiles" on profiles;
create policy "Allow authenticated update on profiles"
on profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
