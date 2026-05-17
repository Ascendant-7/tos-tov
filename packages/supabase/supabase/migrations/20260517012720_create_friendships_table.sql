create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),

  requester_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,

  status varchar(30) not null default 'pending',

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint friendships_status_check
    check (status in ('pending', 'accepted', 'rejected', 'blocked')),

  constraint friendships_no_self_friend
    check (requester_id <> receiver_id)
);

create unique index if not exists unique_friend_pair
on public.friendships (
  least(requester_id, receiver_id),
  greatest(requester_id, receiver_id)
);

create index if not exists idx_friendships_requester_id
on public.friendships(requester_id);

create index if not exists idx_friendships_receiver_id
on public.friendships(receiver_id);

create index if not exists idx_friendships_status
on public.friendships(status);