CREATE TABLE IF NOT EXISTS "attorneys" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "bar_state_as_usps_code" varchar NULL,
    "bar_number" text NOT NULL DEFAULT ''
);

ALTER TABLE attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid();
