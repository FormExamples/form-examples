CREATE TABLE IF NOT EXISTS "person_to_notifies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "title" varchar NOT NULL DEFAULT '',
    "given_names" varchar NOT NULL DEFAULT '',
    "family_name" varchar NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "postal_address_as_full_text" text NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" varchar NOT NULL DEFAULT '',
    "postcode" text NOT NULL DEFAULT '',
    "relationship_to_donor" varchar NOT NULL DEFAULT ''
);

ALTER TABLE person_to_notifies ALTER COLUMN id SET DEFAULT gen_random_uuid();
