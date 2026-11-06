CREATE TABLE IF NOT EXISTS "assessors" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "role" text NOT NULL DEFAULT '',
    "organization" text NOT NULL DEFAULT ''
);

ALTER TABLE assessors ALTER COLUMN id SET DEFAULT gen_random_uuid();
