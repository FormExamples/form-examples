CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();
