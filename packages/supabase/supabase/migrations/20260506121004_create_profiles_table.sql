create table profiles (
  id uuid primary key references auth.users(id),
  email text,
  created_at timestamp default now()
);