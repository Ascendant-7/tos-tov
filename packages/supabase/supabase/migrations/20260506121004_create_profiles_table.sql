create table profiles (
  id uuid primary key,
  email text,
  first_name text,
  last_name text,
  created_at timestamp default now()
);