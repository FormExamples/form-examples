CREATE TABLE IF NOT EXISTS "allergies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "scientific_name" text NOT NULL DEFAULT '',
    "european_union_name" text NOT NULL DEFAULT '',
    "united_states_name" text NOT NULL DEFAULT '',
    "cosmetic_name" text NOT NULL DEFAULT ''
);

ALTER TABLE allergies ALTER COLUMN id SET DEFAULT gen_random_uuid();
