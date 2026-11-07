CREATE TABLE IF NOT EXISTS "asa_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "code" text NOT NULL UNIQUE,
    "system" text NOT NULL,
    "description" text NOT NULL,
    "grade" integer NOT NULL
);

ALTER TABLE asa_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
