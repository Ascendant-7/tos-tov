create table if not exists saved_posts (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  created_at timestamp with time zone not null default now(),

  constraint unique_saved_post unique (post_id, user_id)
);

create index if not exists idx_saved_posts_post_id
on public.saved_posts(post_id);

create index if not exists idx_saved_posts_user_id
on public.saved_posts(user_id);