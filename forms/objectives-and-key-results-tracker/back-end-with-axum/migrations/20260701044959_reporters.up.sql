CREATE TABLE IF NOT EXISTS "reporters" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "role" text NOT NULL DEFAULT ''
);

ALTER TABLE reporters ALTER COLUMN id SET DEFAULT gen_random_uuid();
