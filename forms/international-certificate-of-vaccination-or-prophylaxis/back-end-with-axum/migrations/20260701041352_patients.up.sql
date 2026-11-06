CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "surname" varchar NOT NULL DEFAULT '',
    "given_names" varchar NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "nationality_as_iso_3166_1_alpha_3" varchar NOT NULL DEFAULT '',
    "travel_document_kind" varchar NOT NULL DEFAULT '',
    "travel_document_number" varchar NOT NULL DEFAULT '',
    "travel_document_issuer_as_iso_3166_1_alpha_3" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "consented_to_data_sharing" varchar NOT NULL DEFAULT '',
    "signature_image_data_url" text NOT NULL DEFAULT ''
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();
