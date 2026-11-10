CREATE TABLE IF NOT EXISTS "practitioners" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "role" varchar NOT NULL DEFAULT '',
    "registration_body" varchar NOT NULL DEFAULT '',
    "registration_number" varchar NOT NULL DEFAULT '',
    "organisation_name" varchar NOT NULL DEFAULT '',
    "organisation_ods_code" varchar NOT NULL DEFAULT '',
    "site_name" varchar NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" varchar NULL
);

ALTER TABLE practitioners ALTER COLUMN id SET DEFAULT gen_random_uuid();
