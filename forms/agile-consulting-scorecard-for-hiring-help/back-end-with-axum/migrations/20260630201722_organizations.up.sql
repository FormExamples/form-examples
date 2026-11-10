CREATE TABLE IF NOT EXISTS "organizations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL DEFAULT '',
    "legal_name" varchar NOT NULL DEFAULT '',
    "sector" varchar NOT NULL DEFAULT '',
    "size_band" varchar NOT NULL DEFAULT '',
    "headcount" integer NULL,
    "country" varchar NOT NULL DEFAULT '',
    "region" varchar NOT NULL DEFAULT '',
    "website" text NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT ''
);

ALTER TABLE organizations ALTER COLUMN id SET DEFAULT gen_random_uuid();
