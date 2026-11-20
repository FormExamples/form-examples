CREATE TABLE IF NOT EXISTS "sellers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "postcode" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL
);

ALTER TABLE sellers ALTER COLUMN id SET DEFAULT gen_random_uuid();
