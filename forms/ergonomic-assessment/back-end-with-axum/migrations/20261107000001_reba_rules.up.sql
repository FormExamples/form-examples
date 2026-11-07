CREATE TABLE IF NOT EXISTS "reba_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "code" text NOT NULL UNIQUE,
    "system" text NOT NULL,
    "description" text NOT NULL,
    "score" integer NOT NULL
);

ALTER TABLE reba_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
