CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "title" text NOT NULL DEFAULT '',
    "surname" varchar NOT NULL DEFAULT '',
    "forenames" varchar NOT NULL DEFAULT '',
    "name" varchar NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "sex" text NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "united_kingdom_nhs_number" varchar NULL,
    "full_time_education" varchar NOT NULL DEFAULT '',
    "pregnancy_status" text NOT NULL DEFAULT ''
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_patients_united_kingdom_nhs_number_unique" ON "patients" ("united_kingdom_nhs_number");
