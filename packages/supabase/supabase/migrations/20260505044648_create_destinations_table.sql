create table destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  province text not null,
  location_name text,
  category text,
  cover_image_url text,
  avg_rating numeric(2,1) default 0,
  duration_min int,
  duration_max int,
  budget_min int,
  budget_max int,
  is_trending boolean default false,
  is_hidden_gem boolean default false,
  created_at timestamp default now()
);