CREATE TABLE IF NOT EXISTS "principals" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "birth_date" date NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "postcode" text NULL
);

ALTER TABLE principals ALTER COLUMN id SET DEFAULT gen_random_uuid();
