/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (text, primary key) - UUID for the project
      - `name` (text) - Project name
      - `settings` (jsonb) - Project settings
      - `data` (jsonb) - Project data
      - `last_modified` (timestamptz) - Last modification timestamp
      - `user_id` (uuid) - Reference to auth.users
      
  2. Security
    - Enable RLS on `projects` table
    - Add policies for authenticated users to:
      - Read their own projects
      - Create their own projects
      - Update their own projects
      - Delete their own projects
*/

create table if not exists projects (
  id text primary key,
  name text not null,
  settings jsonb not null,
  data jsonb not null,
  last_modified timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

-- Enable RLS
alter table projects enable row level security;

-- Policies
create policy "Users can read own projects"
  on projects for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- Indexes
create index projects_user_id_idx on projects(user_id);
create index projects_last_modified_idx on projects(last_modified desc);