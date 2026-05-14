-- =========================================
-- Migration: 002_create_budget_tables
-- Description: Create budget table
-- =========================================

create extension if not exists "uuid-ossp";

create table if not exists budgets (
  id uuid primary key default uuid_generate_v4(),

  hotel numeric default 0,
  transport numeric default 0,
  food numeric default 0,

  total_budget numeric default 0,

  created_at timestamp default now()
);