CREATE TABLE IF NOT EXISTS "respondents" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "department" varchar NOT NULL DEFAULT '',
    "seniority" varchar NOT NULL DEFAULT '',
    "timezone" varchar NOT NULL DEFAULT '',
    "preferred_contact" varchar NOT NULL DEFAULT '',
    "organization_id" uuid NOT NULL,
    CONSTRAINT "fk-respondents-organization_id-to-organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE respondents ALTER COLUMN id SET DEFAULT gen_random_uuid();
