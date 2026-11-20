CREATE TABLE IF NOT EXISTS "county_clerks" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "state" varchar NOT NULL DEFAULT '',
    "county" text NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "website" text NULL
);

ALTER TABLE county_clerks ALTER COLUMN id SET DEFAULT gen_random_uuid();
