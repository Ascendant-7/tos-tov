create table if not exists post_likes (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  created_at timestamp with time zone not null default now(),

  constraint unique_post_like unique (post_id, user_id)
);