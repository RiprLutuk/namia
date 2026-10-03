-- Domain tables retain IDs and ordering from the existing content store.

CREATE TABLE categories (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  slug text,
  name text,
  description text,
  icon text
);

CREATE TABLE faq_categories (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  name text,
  description text,
  is_investor integer
);

CREATE TABLE products (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  category_id integer,
  category_slug text,
  name text,
  provider text,
  logo text,
  description text,
  min_amount double precision,
  max_amount double precision,
  min_tenor_months integer,
  max_tenor_months integer,
  interest_rate_annual double precision,
  admin_fee double precision,
  rating double precision,
  sharia_accredited boolean,
  contract_type text,
  features jsonb,
  apply_url text,
  is_featured boolean,
  target_audience text,
  FOREIGN KEY (category_id) REFERENCES categories(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE faqs (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  category_id integer,
  category_name text,
  is_investor integer,
  question text,
  answer text,
  FOREIGN KEY (category_id) REFERENCES faq_categories(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE blog_posts (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  slug text,
  title text,
  content jsonb,
  excerpt text,
  photo text,
  author text,
  author_role text,
  category text,
  published_at text,
  date text,
  read_time_minutes integer,
  read_time text,
  featured boolean,
  summary text,
  takeaway text
);

CREATE TABLE personil (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  full_name text,
  job_level integer,
  job_title text,
  biography text,
  photo text,
  department text,
  education text
);

CREATE TABLE stats (
  id integer PRIMARY KEY CHECK (id > 0),
  position integer NOT NULL,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  title text,
  amount text,
  unit text,
  icon text,
  subtitle text
);

CREATE INDEX products_category ON products(category_id);

CREATE INDEX faqs_category ON faqs(category_id);

ALTER TABLE app_leads RENAME TO leads;

ALTER TABLE leads ADD COLUMN full_name text;

ALTER TABLE leads ADD COLUMN email text;

ALTER TABLE leads ADD COLUMN phone text;

ALTER TABLE leads ADD COLUMN need_category text;

ALTER TABLE leads ADD COLUMN target_amount double precision;

ALTER TABLE leads ADD COLUMN target_tenor_months integer;

ALTER TABLE leads ADD COLUMN notes text;

ALTER TABLE leads ADD COLUMN nik text;

ALTER TABLE leads ADD COLUMN employment_type text;

ALTER TABLE leads ADD COLUMN monthly_income double precision;

ALTER TABLE leads ADD COLUMN status text;

ALTER TABLE leads ADD COLUMN kyc_step integer;

ALTER TABLE leads ADD COLUMN submitted_at text;

ALTER TABLE leads ADD COLUMN reviewed_at text;

ALTER TABLE leads ADD COLUMN reviewed_by uuid;

ALTER TABLE leads ADD COLUMN review_note text;

ALTER TABLE leads ADD COLUMN date_of_birth text;

ALTER TABLE leads ADD COLUMN address text;

ALTER TABLE leads ADD COLUMN legacy_reference integer;

ALTER TABLE leads ADD COLUMN legacy_payload jsonb;
