CREATE TABLE IF NOT EXISTS "architectural_decisions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "arc42_documentation_id" uuid NOT NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "title" text NOT NULL DEFAULT '',
    "status" text NOT NULL DEFAULT '',
    "context" text NOT NULL DEFAULT '',
    "decision" text NOT NULL DEFAULT '',
    "consequences" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-architectural_decisions-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE architectural_decisions ALTER COLUMN id SET DEFAULT gen_random_uuid();
