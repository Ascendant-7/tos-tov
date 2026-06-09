create table if not exists post_media (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null references public.community_posts(id) on delete cascade,

  bucket_name text not null default 'community-posts',
  file_path text not null,
  public_url text,

  media_type varchar(20) not null,
  position int not null default 0,

  created_at timestamp with time zone not null default now(),

  constraint post_media_type_check
    check (media_type in ('image', 'video')),

  constraint post_media_position_check
    check (position >= 0),

  constraint post_media_file_path_check
    check (length(trim(file_path)) > 0)
);