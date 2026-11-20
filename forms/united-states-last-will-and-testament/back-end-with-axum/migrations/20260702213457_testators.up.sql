CREATE TABLE IF NOT EXISTS "testators" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "birth_date" date NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "state" varchar NULL,
    "postcode" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "citizenship_status" varchar NOT NULL DEFAULT ''
);

ALTER TABLE testators ALTER COLUMN id SET DEFAULT gen_random_uuid();
