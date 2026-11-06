CREATE TABLE IF NOT EXISTS "context_partners" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "kind" text NOT NULL DEFAULT '',
    "name" text NOT NULL DEFAULT '',
    "interface_description" text NOT NULL DEFAULT '',
    "protocol" text NOT NULL DEFAULT '',
    "direction" text NOT NULL DEFAULT '',
    "arc42_documentation_id" uuid NOT NULL,
    CONSTRAINT "fk-context_partners-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE context_partners ALTER COLUMN id SET DEFAULT gen_random_uuid();
