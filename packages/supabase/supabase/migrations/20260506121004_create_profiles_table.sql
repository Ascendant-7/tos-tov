create table profiles (
  id uuid primary key references auth.users(id),
  email text,
  first_name text,
  last_name text,
  created_at timestamp default now()
);