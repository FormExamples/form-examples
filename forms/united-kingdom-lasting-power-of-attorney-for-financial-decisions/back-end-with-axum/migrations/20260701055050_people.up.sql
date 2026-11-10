CREATE TABLE IF NOT EXISTS "people" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "title" text NOT NULL DEFAULT '',
    "first_names" text NOT NULL DEFAULT '',
    "last_name" text NOT NULL DEFAULT '',
    "other_names" text NOT NULL DEFAULT '',
    "date_of_birth" date NULL,
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "address_id" uuid NULL,
    "is_trust_corporation" boolean NOT NULL DEFAULT false,
    "trust_corporation_number" text NOT NULL DEFAULT '',
    "is_bankrupt" boolean NOT NULL DEFAULT false,
    "has_debt_relief_order" boolean NOT NULL DEFAULT false
);

ALTER TABLE people ALTER COLUMN id SET DEFAULT gen_random_uuid();
