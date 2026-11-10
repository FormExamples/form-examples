CREATE TABLE IF NOT EXISTS "patients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "birth_date" date NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "identifier_type" varchar NOT NULL DEFAULT '',
    "identifier_value" varchar NOT NULL DEFAULT '',
    "email" text NULL,
    "phone" text NULL,
    "emergency_contact_name" varchar NOT NULL DEFAULT '',
    "emergency_contact_relationship" varchar NOT NULL DEFAULT '',
    "emergency_contact_phone" varchar NOT NULL DEFAULT ''
);

ALTER TABLE patients ALTER COLUMN id SET DEFAULT gen_random_uuid();
