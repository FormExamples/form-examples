CREATE TABLE IF NOT EXISTS "petitioners" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "birth_date" date NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "state_as_usps_code" varchar NULL,
    "postcode" text NULL
);

ALTER TABLE petitioners ALTER COLUMN id SET DEFAULT gen_random_uuid();
