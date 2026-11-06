CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "birth_date" date NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "united_kingdom_nhs_number" varchar NULL,
    "height_as_cm" double precision NULL,
    "weight_as_kg" double precision NULL,
    "body_mass_index" double precision NULL,
    "waist_as_cm" double precision NULL,
    "mid_upper_arm_circumference_as_cm" double precision NULL,
    "calf_circumference_as_cm" double precision NULL,
    "preferred_language" text NULL,
    "ethnicity" text NULL
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_patients_united_kingdom_nhs_number_unique" ON "patients" ("united_kingdom_nhs_number");
