CREATE TABLE IF NOT EXISTS "employers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "industry_sector" varchar NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "occupational_health_contact_name" text NOT NULL DEFAULT '',
    "occupational_health_contact_email" text NOT NULL DEFAULT '',
    "occupational_health_contact_phone" text NOT NULL DEFAULT '',
    "hr_contact_name" text NOT NULL DEFAULT '',
    "hr_contact_email" text NOT NULL DEFAULT ''
);

ALTER TABLE employers ALTER COLUMN id SET DEFAULT gen_random_uuid();
