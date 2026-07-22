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

-- Motor de monitoreo de La Gaceta: keywords a vigilar y matches ya notificados.

create table if not exists keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  term text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  keyword_id uuid not null references keywords(id) on delete cascade,
  document_id text,
  edition_date date not null,
  section text not null,
  snippet text not null,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (keyword_id, edition_date, document_id, section)
);

alter table keywords enable row level security;
alter table matches enable row level security;

-- Cada usuario autenticado solo puede ver y administrar sus propias keywords.
-- El cron job usa la service_role key, que ignora RLS por completo.
create policy "Users manage own keywords" on keywords
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- No hay policy pública sobre matches: solo el cron job (service_role) escribe ahí.
