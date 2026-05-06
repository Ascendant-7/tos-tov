-- =========================================
-- Migration: 001_create_itinerary_tables
-- Description: Create core itinerary tables
-- =========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================
-- TABLE: trips
-- =========================================
create table if not exists trips (
  id uuid primary key default uuid_generate_v4(),
  title varchar not null,
  description text,
  created_at timestamp default now()
);

-- =========================================
-- TABLE: itinerary_days
-- =========================================
create table if not exists itinerary_days (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references trips(id) on delete cascade,
  day_number int not null,
  title varchar,
  created_at timestamp default now()
);

-- =========================================
-- TABLE: itinerary_items
-- =========================================
create table if not exists itinerary_items (
  id uuid primary key default uuid_generate_v4(),
  day_id uuid not null references itinerary_days(id) on delete cascade,

  time varchar not null,
  title varchar not null,
  category varchar default 'activity',

  duration varchar,
  cost varchar,
  notes text,

  position int default 0,
  created_at timestamp default now()
);

-- =========================================
-- INDEXES
-- =========================================
create index if not exists idx_itinerary_items_day_position
on itinerary_items(day_id, position);