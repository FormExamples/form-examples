CREATE TABLE IF NOT EXISTS "centers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "who_designation_reference" varchar NOT NULL DEFAULT '',
    "national_authority_reference" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "country_as_iso_3166_1_alpha_3" varchar NULL,
    "postcode" text NULL,
    "uniform_stamp_image_data_url" text NOT NULL DEFAULT '',
    "authorised_diseases" text NOT NULL DEFAULT 'yellow-fever',
    "designation_valid_from" date NULL,
    "designation_valid_until" date NULL
);

ALTER TABLE centers ALTER COLUMN id SET DEFAULT gen_random_uuid();
