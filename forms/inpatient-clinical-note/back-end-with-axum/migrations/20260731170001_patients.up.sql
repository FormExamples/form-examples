CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "birth_date" date NOT NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "united_kingdom_nhs_number" varchar NULL,
    "hospital_mrn" varchar NULL,
    "height_as_cm" decimal NULL,
    "weight_as_kg" decimal NULL,
    "body_mass_index" decimal NULL,
    "allergies_summary" text NOT NULL DEFAULT ''
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();
