CREATE TABLE IF NOT EXISTS "participants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "organisation" varchar NOT NULL DEFAULT '',
    "team" varchar NOT NULL DEFAULT '',
    "notify_on" varchar NOT NULL DEFAULT ''
);

ALTER TABLE participants ALTER COLUMN id SET DEFAULT gen_random_uuid();
