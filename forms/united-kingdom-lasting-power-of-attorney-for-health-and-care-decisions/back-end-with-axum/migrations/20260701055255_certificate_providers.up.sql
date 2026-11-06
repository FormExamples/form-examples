CREATE TABLE IF NOT EXISTS "certificate_providers" (
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
    "route" varchar NOT NULL DEFAULT '',
    "profession" varchar NOT NULL DEFAULT '',
    "profession_registration_number" varchar NOT NULL DEFAULT '',
    "years_known_donor" double precision NULL,
    "relationship_to_donor" varchar NOT NULL DEFAULT '',
    "declared_not_family" varchar NOT NULL DEFAULT '',
    "declared_not_employee" varchar NOT NULL DEFAULT '',
    "declared_not_attorney" varchar NOT NULL DEFAULT ''
);

ALTER TABLE certificate_providers ALTER COLUMN id SET DEFAULT gen_random_uuid();
