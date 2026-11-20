CREATE TABLE IF NOT EXISTS "reviewers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "role" varchar NOT NULL DEFAULT ''
);

ALTER TABLE reviewers ALTER COLUMN id SET DEFAULT gen_random_uuid();
