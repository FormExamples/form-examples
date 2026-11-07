CREATE TABLE IF NOT EXISTS "prescribers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "goc_registration_number" varchar NOT NULL UNIQUE,
    "role" varchar NOT NULL DEFAULT '',
    "practice_name" text NOT NULL DEFAULT '',
    "practice_address" text NOT NULL DEFAULT '',
    "postcode" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "email" text NULL,
    "phone" text NULL
);

ALTER TABLE prescribers ALTER COLUMN id SET DEFAULT gen_random_uuid();
