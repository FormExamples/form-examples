CREATE TABLE IF NOT EXISTS "stakeholders" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "name" text NOT NULL DEFAULT '',
    "role" text NOT NULL DEFAULT '',
    "concerns" text NOT NULL DEFAULT '',
    "arc42_documentation_id" uuid NOT NULL,
    CONSTRAINT "fk-stakeholders-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE stakeholders ALTER COLUMN id SET DEFAULT gen_random_uuid();
