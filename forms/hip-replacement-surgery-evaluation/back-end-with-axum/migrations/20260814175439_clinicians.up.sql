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
    "gmc_number" text NOT NULL DEFAULT '',
    "site_name" text NOT NULL DEFAULT '',
    "employer" text NOT NULL DEFAULT ''
);

ALTER TABLE clinicians ALTER COLUMN id SET DEFAULT gen_random_uuid();
