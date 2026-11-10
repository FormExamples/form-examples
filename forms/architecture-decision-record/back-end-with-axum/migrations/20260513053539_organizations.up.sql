CREATE TABLE IF NOT EXISTS "organizations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "name" varchar NOT NULL,
    "legal_name" varchar NOT NULL DEFAULT '',
    "industry" varchar NOT NULL DEFAULT '',
    "domain" varchar NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "description" text NOT NULL DEFAULT ''
);

ALTER TABLE organizations ALTER COLUMN id SET DEFAULT gen_random_uuid();
