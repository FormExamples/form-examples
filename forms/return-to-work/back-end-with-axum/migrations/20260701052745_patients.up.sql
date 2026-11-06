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
    "job_title" varchar NOT NULL DEFAULT '',
    "role_description" text NOT NULL DEFAULT '',
    "contracted_hours_per_week" double precision NULL,
    "shift_pattern" varchar NOT NULL DEFAULT '',
    "safety_critical_role" varchar NOT NULL DEFAULT '',
    "dvla_group_1_licence_held" varchar NOT NULL DEFAULT '',
    "dvla_group_2_licence_held" varchar NOT NULL DEFAULT ''
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_patients_united_kingdom_nhs_number_unique" ON "patients" ("united_kingdom_nhs_number");
