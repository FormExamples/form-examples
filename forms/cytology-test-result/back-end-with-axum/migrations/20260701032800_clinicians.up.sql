CREATE TABLE IF NOT EXISTS "clinicians" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "role" text NOT NULL DEFAULT '',
    "registration_body" text NOT NULL DEFAULT '',
    "registration_number" text NOT NULL DEFAULT '',
    "united_kingdom_nhs_number" varchar NULL
);

ALTER TABLE clinicians ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_clinicians_united_kingdom_nhs_number_unique" ON "clinicians" ("united_kingdom_nhs_number");
