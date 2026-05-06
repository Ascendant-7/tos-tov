create table reviews (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references destinations(id) on delete cascade,
  rating int check (rating between 1 and 5),
  created_at timestamp default now()
);