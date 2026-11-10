CREATE TABLE IF NOT EXISTS "practitioners" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "role" text NOT NULL DEFAULT '',
    "registration_body" text NOT NULL DEFAULT '',
    "registration_number" text NOT NULL DEFAULT '',
    "practice_name" varchar NOT NULL DEFAULT '',
    "practice_code" varchar NOT NULL DEFAULT '',
    "practitioner_code" varchar NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "united_kingdom_nhs_number" varchar NULL
);

ALTER TABLE practitioners ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_practitioners_united_kingdom_nhs_number_unique" ON "practitioners" ("united_kingdom_nhs_number");
