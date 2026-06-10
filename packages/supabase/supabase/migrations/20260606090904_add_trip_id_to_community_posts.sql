ALTER TABLE community_posts
ADD COLUMN trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;
