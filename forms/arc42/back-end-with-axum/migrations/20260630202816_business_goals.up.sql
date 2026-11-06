CREATE TABLE IF NOT EXISTS "business_goals" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "name" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "arc42_documentation_id" uuid NOT NULL,
    CONSTRAINT "fk-business_goals-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE business_goals ALTER COLUMN id SET DEFAULT gen_random_uuid();
