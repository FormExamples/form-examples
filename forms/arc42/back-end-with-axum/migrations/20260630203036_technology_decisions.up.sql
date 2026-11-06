CREATE TABLE IF NOT EXISTS "technology_decisions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "category" text NOT NULL DEFAULT '',
    "choice" text NOT NULL DEFAULT '',
    "rationale" text NOT NULL DEFAULT '',
    "arc42_documentation_id" uuid NOT NULL,
    CONSTRAINT "fk-technology_decisions-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE technology_decisions ALTER COLUMN id SET DEFAULT gen_random_uuid();
