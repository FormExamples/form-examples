CREATE TABLE IF NOT EXISTS "informants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL
);

ALTER TABLE informants ALTER COLUMN id SET DEFAULT gen_random_uuid();
