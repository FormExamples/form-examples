CREATE TABLE IF NOT EXISTS "arc42_documentation_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "arc42_documentation_grade_id" uuid NOT NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "category" text NOT NULL DEFAULT '',
    "priority" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-arc42_documentation_grade_flags-arc42_documentation_grade_id-to-arc42_documentation_grades" FOREIGN KEY ("arc42_documentation_grade_id") REFERENCES "arc42_documentation_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE arc42_documentation_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
