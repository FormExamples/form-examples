CREATE TABLE IF NOT EXISTS "applicants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "state" varchar NOT NULL DEFAULT '',
    "zip_code" text NULL
);

ALTER TABLE applicants ALTER COLUMN id SET DEFAULT gen_random_uuid();
