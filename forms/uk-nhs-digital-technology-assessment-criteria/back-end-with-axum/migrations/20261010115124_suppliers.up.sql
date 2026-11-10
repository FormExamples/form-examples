CREATE TABLE IF NOT EXISTS "suppliers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "trading_name" text NOT NULL DEFAULT '',
    "company_registration_number" text NOT NULL DEFAULT '',
    "country_of_registration_as_iso_3166_1_alpha_2" varchar NULL,
    "ico_registration_number" text NOT NULL DEFAULT '',
    "website" text NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NULL,
    "postcode" text NULL,
    "contact_name" text NOT NULL DEFAULT '',
    "contact_email" text NULL,
    "contact_phone" text NULL
);

ALTER TABLE suppliers ALTER COLUMN id SET DEFAULT gen_random_uuid();
