CREATE TABLE IF NOT EXISTS "quality_scenarios" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "arc42_documentation_id" uuid NOT NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "source" text NOT NULL DEFAULT '',
    "stimulus" text NOT NULL DEFAULT '',
    "artifact" text NOT NULL DEFAULT '',
    "response" text NOT NULL DEFAULT '',
    "measure" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-quality_scenarios-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE quality_scenarios ALTER COLUMN id SET DEFAULT gen_random_uuid();
