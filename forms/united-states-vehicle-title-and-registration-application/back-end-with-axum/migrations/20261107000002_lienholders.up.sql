CREATE TABLE IF NOT EXISTS "lienholders" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "state_code" varchar NOT NULL DEFAULT '',
    "postcode" text NULL,
    "electronic_lien_identifier" text NOT NULL DEFAULT ''
);

ALTER TABLE lienholders ALTER COLUMN id SET DEFAULT gen_random_uuid();
