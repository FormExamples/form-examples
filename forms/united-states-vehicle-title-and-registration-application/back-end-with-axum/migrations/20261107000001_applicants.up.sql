CREATE TABLE IF NOT EXISTS "applicants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "owner_type" varchar NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "state_code" varchar NOT NULL DEFAULT '',
    "postcode" text NULL,
    "identification_type" varchar NOT NULL DEFAULT '',
    "identification_number" text NOT NULL DEFAULT ''
);

ALTER TABLE applicants ALTER COLUMN id SET DEFAULT gen_random_uuid();
