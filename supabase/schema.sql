-- Tabla de waitlist para Gazette.
-- Correr en el SQL editor de Supabase antes de usar el formulario "avisame cuando lance".

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

-- Permite insertar filas desde el cliente anónimo (clave anon), pero no leer ni actualizar.
create policy "Allow anonymous insert" on waitlist
  for insert
  to anon
  with check (true);
