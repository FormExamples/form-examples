CREATE TABLE IF NOT EXISTS "clinicians" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "specialty" text NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "registration_body" varchar NOT NULL DEFAULT '',
    "registration_number" text NOT NULL DEFAULT '',
    "clinic_name" text NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NOT NULL DEFAULT ''
);

ALTER TABLE clinicians ALTER COLUMN id SET DEFAULT gen_random_uuid();
