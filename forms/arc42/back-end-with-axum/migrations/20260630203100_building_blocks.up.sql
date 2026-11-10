CREATE TABLE IF NOT EXISTS "building_blocks" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "name" text NOT NULL DEFAULT '',
    "responsibility" text NOT NULL DEFAULT '',
    "interfaces" text NOT NULL DEFAULT '',
    "arc42_documentation_id" uuid NOT NULL,
    "parent_id" uuid NULL,
    CONSTRAINT "fk-building_blocks-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-building_blocks-parent_id-to-building_blocks" FOREIGN KEY ("parent_id") REFERENCES "building_blocks" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE building_blocks ALTER COLUMN id SET DEFAULT gen_random_uuid();
