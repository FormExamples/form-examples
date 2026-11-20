CREATE TABLE IF NOT EXISTS "applicants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NOT NULL DEFAULT '',
    "postcode" text NOT NULL DEFAULT ''
);

ALTER TABLE applicants ALTER COLUMN id SET DEFAULT gen_random_uuid();
