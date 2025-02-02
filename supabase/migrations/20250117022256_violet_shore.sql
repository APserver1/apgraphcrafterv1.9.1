/*
  # Crear tabla de plantillas

  1. Nueva Tabla
    - `templates`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `tags` (text[], array de etiquetas)
      - `thumbnail_index` (numeric, índice de la animación para la miniatura)
      - `project_data` (jsonb, datos del proyecto)
      - `user_id` (uuid, foreign key a auth.users)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `templates` table
    - Add policies for:
      - Select: Todos pueden ver las plantillas
      - Insert: Solo usuarios autenticados pueden crear plantillas
      - Update/Delete: Solo el creador puede modificar/eliminar sus plantillas
*/

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tags text[] not null default '{}',
  thumbnail_index numeric not null,
  project_data jsonb not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table templates enable row level security;

-- Policies
create policy "Anyone can view templates"
  on templates for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can create templates"
  on templates for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own templates"
  on templates for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own templates"
  on templates for delete
  to authenticated
  using (auth.uid() = user_id);

-- Indexes
create index templates_user_id_idx on templates(user_id);
create index templates_created_at_idx on templates(created_at desc);
create index templates_tags_idx on templates using gin(tags);