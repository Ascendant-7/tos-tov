-- =========================================
-- Migration: Add RLS Policies for Profiles
-- Description: Enable Row-Level Security on profiles table and allow authenticated inserts
-- Date: 2026-05-30
-- =========================================

-- Enable RLS on profiles table
alter table profiles enable row level security;

-- Allow authenticated users to insert their own profile
create policy "Allow authenticated insert on profiles"
on profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Allow authenticated users to view all profiles
create policy "Allow authenticated select on profiles"
on profiles
for select
to authenticated
using (true);
