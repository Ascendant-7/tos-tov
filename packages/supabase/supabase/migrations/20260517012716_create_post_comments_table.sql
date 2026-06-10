create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  content text not null,

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint post_comments_content_check
    check (length(trim(content)) > 0)
);