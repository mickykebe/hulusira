CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE
  role TEXT NOT NULL CONSTRAINT role_values CHECK (role IN ('user', 'admin'))
);

CREATE TABLE company (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  logo TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE job (
  id SERIAL PRIMARY KEY,
  position TEXT NOT NULL,
  job_type TEXT NOT NULL CONSTRAINT check_value CHECK (job_type IN ('Full-time', 'Part-time', 'Freelance', 'Internship', 'Temporary'))
  company_id INTEGER REFERENCES company(id),
  city TEXT,
  primary_tag INTEGER REFERENCES tag(id),
  monthly_salary TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  how_to_apply TEXT,
  apply_url TEXT,
  apply_email TEXT,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  closed BOOLEAN NOT NULL DEFAULT FALSE,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug TEXT,
  admin_token uuid DEFAULT uuid_generate_v4(), 
  CONSTRAINT require_apply_method CHECK (apply_url IS NOT NULL OR apply_email IS NOT NULL)
);

CREATE TABLE job_tags (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES job(id) NOT NULL ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tag(id) NOT NULL,
  UNIQUE (job_id, tag_id)
);