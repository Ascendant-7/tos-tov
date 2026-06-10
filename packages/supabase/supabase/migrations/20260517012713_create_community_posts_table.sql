create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete set null,

  title text,
  content text not null,

  visit_status varchar(30) not null default 'visited',
  visibility varchar(30) not null default 'public',
  status varchar(30) not null default 'draft',

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint community_posts_visit_status_check
    check (visit_status in ('visited', 'want_to_go', 'planned')),

  constraint community_posts_visibility_check
    check (visibility in ('public', 'friends', 'private')),

  constraint community_posts_status_check
    check (status in ('draft', 'published', 'cancelled')),

  constraint community_posts_title_check
    check (length(trim(title)) > 0),

  constraint community_posts_content_check
    check (length(trim(content)) > 0)
);