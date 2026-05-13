-- =========================================
-- Migration: Add RLS Policies for Destinations
-- Description: Enable Row-Level Security on destinations table
-- =========================================

-- Enable RLS on destinations table
alter table destinations enable row level security;

-- Policy: Allow anyone to read all destinations
create policy "Allow public read access to destinations"
on destinations
for select
to public
using (true);

-- Policy: Allow anonymous users to insert destinations (for public submissions)
create policy "Allow anonymous insert to destinations"
on destinations
for insert
to anon
with check (true);

-- Policy: Also allow authenticated users to insert destinations
create policy "Allow authenticated users to insert destinations"
on destinations
for insert
to authenticated
with check (true);

-- Policy: Allow anyone to update destinations
create policy "Allow public updates to destinations"
on destinations
for update
to public
using (true)
with check (true);

-- Policy: Allow anyone to delete destinations
create policy "Allow public delete access to destinations"
on destinations
for delete
to public
using (true);
