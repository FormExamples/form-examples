CREATE TABLE IF NOT EXISTS "arc42_documentation_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "arc42_documentation_id" uuid NOT NULL UNIQUE,
    "computed_maturity" text NOT NULL DEFAULT '',
    "final_maturity" text NOT NULL DEFAULT '',
    "override_reason" text NOT NULL DEFAULT '',
    "completeness_section_1" text NOT NULL DEFAULT '',
    "completeness_section_2" text NOT NULL DEFAULT '',
    "completeness_section_3" text NOT NULL DEFAULT '',
    "completeness_section_4" text NOT NULL DEFAULT '',
    "completeness_section_5" text NOT NULL DEFAULT '',
    "completeness_section_6" text NOT NULL DEFAULT '',
    "completeness_section_7" text NOT NULL DEFAULT '',
    "completeness_section_8" text NOT NULL DEFAULT '',
    "completeness_section_9" text NOT NULL DEFAULT '',
    "completeness_section_10" text NOT NULL DEFAULT '',
    "completeness_section_11" text NOT NULL DEFAULT '',
    "completeness_section_12" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-arc42_documentation_grades-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE arc42_documentation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
