CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "social_security_number" varchar NOT NULL DEFAULT '',
    "street_address" text NOT NULL DEFAULT '',
    "city" varchar NOT NULL DEFAULT '',
    "state" varchar NOT NULL DEFAULT '',
    "zip_code" varchar NOT NULL DEFAULT '',
    "phone" varchar NOT NULL DEFAULT '',
    "email" varchar NOT NULL DEFAULT ''
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();
