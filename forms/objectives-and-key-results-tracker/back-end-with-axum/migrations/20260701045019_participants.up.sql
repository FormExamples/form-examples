CREATE TABLE IF NOT EXISTS "participants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "okr_objective_id" uuid NOT NULL,
    "role" text NOT NULL DEFAULT '',
    "name" text NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT ''
);

ALTER TABLE participants ALTER COLUMN id SET DEFAULT gen_random_uuid();
