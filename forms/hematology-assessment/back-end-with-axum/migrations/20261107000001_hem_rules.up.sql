CREATE TABLE IF NOT EXISTS "hem_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "code" text NOT NULL UNIQUE,
    "category" text NOT NULL,
    "description" text NOT NULL,
    "concern_level" text NOT NULL
);

ALTER TABLE hem_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
