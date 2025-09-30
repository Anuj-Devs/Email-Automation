/* Email rich content templates users can pick for sending */
create table if not exists email_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  html text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

/* SMTP or provider configurations (simplified) */
create table if not exists email_config (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  host text not null,
  port integer not null,
  username text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

/* Log of sent emails */
create table if not exists sent_emails (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  html text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

/* Helpful indexes */
create index if not exists idx_email_contents_active on email_contents(is_active);
create index if not exists idx_email_config_active on email_config(is_active);
create index if not exists idx_sent_emails_created_at on sent_emails(created_at desc);
