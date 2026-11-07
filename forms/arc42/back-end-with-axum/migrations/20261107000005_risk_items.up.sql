CREATE TABLE IF NOT EXISTS "risk_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "arc42_documentation_id" uuid NOT NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "kind" text NOT NULL DEFAULT '',
    "name" text NOT NULL DEFAULT '',
    "probability" text NOT NULL DEFAULT '',
    "impact" text NOT NULL DEFAULT '',
    "mitigation" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-risk_items-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE risk_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
