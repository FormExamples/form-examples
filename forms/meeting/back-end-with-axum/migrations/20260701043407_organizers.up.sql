CREATE TABLE IF NOT EXISTS "organizers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL DEFAULT '',
    "email" varchar NOT NULL DEFAULT '',
    "phone" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "organisation" varchar NOT NULL DEFAULT '',
    "team" varchar NOT NULL DEFAULT '',
    "location" varchar NOT NULL DEFAULT '',
    "timezone" varchar NOT NULL DEFAULT '',
    "preferred_contact" varchar NOT NULL DEFAULT ''
);

ALTER TABLE organizers ALTER COLUMN id SET DEFAULT gen_random_uuid();
