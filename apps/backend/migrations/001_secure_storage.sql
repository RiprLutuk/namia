CREATE TABLE IF NOT EXISTS app_users (
 id uuid PRIMARY KEY,
 email text NOT NULL UNIQUE,
 full_name text NOT NULL,
 password_hash text NOT NULL,
 role text NOT NULL CHECK (role IN ('admin','borrower','lender')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_sessions (
 token_hash text PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS app_sessions_expiry ON app_sessions(expires_at);
CREATE TABLE IF NOT EXISTS app_leads (
 id serial PRIMARY KEY,
 owner_id uuid REFERENCES app_users(id),
 data jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS app_leads_owner ON app_leads(owner_id, id DESC);
CREATE TABLE IF NOT EXISTS app_contacts (
 id uuid PRIMARY KEY,
 data jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_content (
 id integer PRIMARY KEY CHECK (id = 1),
 data jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS app_rate_limits (
 key text PRIMARY KEY,
 count integer NOT NULL,
 reset_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS app_rate_limits_expiry ON app_rate_limits(reset_at);
CREATE TABLE IF NOT EXISTS app_audit_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 actor_id uuid REFERENCES app_users(id),
 action text NOT NULL,
 resource_id text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
