CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "sex_at_birth" varchar NOT NULL DEFAULT '',
    "nationality_as_iso_3166_1_alpha_2" varchar NULL,
    "passport_number" text NOT NULL DEFAULT '',
    "united_kingdom_nhs_number" varchar NULL,
    "national_health_id" text NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NOT NULL DEFAULT '',
    "emergency_contact_name" text NOT NULL DEFAULT '',
    "emergency_contact_relationship" text NOT NULL DEFAULT '',
    "emergency_contact_phone" text NOT NULL DEFAULT '',
    "weight_as_kg" double precision NULL,
    "height_as_cm" double precision NULL
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_patients_united_kingdom_nhs_number_unique" ON "patients" ("united_kingdom_nhs_number");
