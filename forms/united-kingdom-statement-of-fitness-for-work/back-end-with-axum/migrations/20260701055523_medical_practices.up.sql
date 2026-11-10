CREATE TABLE IF NOT EXISTS "medical_practices" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "postal_address_as_full_text" text NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "phone" text NULL,
    "email" text NULL,
    "ods_code" text NULL,
    "setting" text NOT NULL DEFAULT ''
);

ALTER TABLE medical_practices ALTER COLUMN id SET DEFAULT gen_random_uuid();
