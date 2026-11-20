CREATE TABLE IF NOT EXISTS "billing_authorities" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "gss_code" varchar NULL,
    "email" text NULL,
    "phone" text NULL,
    "website_url" text NULL
);

ALTER TABLE billing_authorities ALTER COLUMN id SET DEFAULT gen_random_uuid();
