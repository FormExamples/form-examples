CREATE TABLE IF NOT EXISTS "authors" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "name" varchar NOT NULL DEFAULT '',
    "email" varchar NOT NULL DEFAULT '',
    "phone" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "organization_name" varchar NOT NULL DEFAULT '',
    "team_name" varchar NOT NULL DEFAULT ''
);

ALTER TABLE authors ALTER COLUMN id SET DEFAULT gen_random_uuid();
