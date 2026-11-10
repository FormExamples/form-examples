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
    "role" varchar NOT NULL DEFAULT '',
    "grade" varchar NOT NULL DEFAULT '',
    "specialty" varchar NOT NULL DEFAULT '',
    "registration_body" varchar NOT NULL DEFAULT '',
    "registration_number" text NOT NULL DEFAULT ''
);

ALTER TABLE clinicians ALTER COLUMN id SET DEFAULT gen_random_uuid();
