CREATE TABLE IF NOT EXISTS "assessors" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "office_name" text NOT NULL DEFAULT '',
    "county" text NOT NULL DEFAULT '',
    "state" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT ''
);

ALTER TABLE assessors ALTER COLUMN id SET DEFAULT gen_random_uuid();
