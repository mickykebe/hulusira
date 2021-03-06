CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  telegram_id INTEGER UNIQUE,
  telegram_user_name TEXT UNIQUE,
  password TEXT,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  role TEXT NOT NULL CONSTRAINT role_values CHECK (role IN ('user', 'admin')),
  CONSTRAINT require_user CHECK (email IS NOT NULL OR telegram_id IS NOT NULL),
  CONSTRAINT require_password CHECK ((email IS NOT NULL AND password IS NOT NULL) OR (email IS NULL))
);

CREATE TABLE company (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  logo TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  owner INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tag (
  name TEXT PRIMARY KEY,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE job (
  id SERIAL PRIMARY KEY,
  position TEXT NOT NULL,
  job_type TEXT NOT NULL CONSTRAINT check_value CHECK (job_type IN ('Full-time', 'Part-time', 'Freelance', 'Internship', 'Temporary', 'Contract')),
  career_level TEXT NOT NULL CONSTRAINT career_level_values CHECK (career_level IN ('entry', 'junior', 'mid', 'senior', 'manager', 'executive', 'senior-executive')),
  company_id INTEGER REFERENCES company(id) ON DELETE SET NULL,
  location TEXT,
  salary TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  how_to_apply TEXT,
  apply_url TEXT,
  apply_email TEXT,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  deadline Date,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug TEXT,
  admin_token uuid DEFAULT uuid_generate_v4(),
  owner INTEGER REFERENCES users(id) ON DELETE SET NULL,
  approval_status TEXT NOT NULL CONSTRAINT approval_values CHECK (approval_status IN ('Pending', 'Active', 'Declined', 'Closed')) DEFAULT 'Pending',
  views INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE job_tags (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL REFERENCES tag(name),
  is_primary BOOLEAN DEFAULT FALSE,
  UNIQUE (job_id, tag_name)
);

CREATE TABLE job_social_post (
  job_id INTEGER PRIMARY KEY REFERENCES job(id) ON DELETE CASCADE,
  telegram_message_id INTEGER,
  telegram_messages jsonb,
  facebook_post_id TEXT
);

CREATE TABLE user_confirmation(
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  confirmation_key TEXT NOT NULL UNIQUE
);