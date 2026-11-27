CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "family_name" varchar NOT NULL,
    "given_names" varchar NOT NULL DEFAULT '',
    "previous_name" varchar NOT NULL DEFAULT '',
    "birth_date" date NOT NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "ethnicity" varchar NOT NULL DEFAULT '',
    "national_health_identifier" varchar NOT NULL DEFAULT '',
    "medical_record_number" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();
