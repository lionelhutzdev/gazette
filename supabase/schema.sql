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
-- Sin auth todavía: las keywords se asocian directamente a un email.

create table if not exists keywords (
  id uuid primary key default gen_random_uuid(),
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

-- Estas tablas no llevan RLS con policy pública: se acceden solo desde el
-- cron job del servidor con la clave secreta de Supabase, nunca desde el browser.
alter table keywords enable row level security;
alter table matches enable row level security;
