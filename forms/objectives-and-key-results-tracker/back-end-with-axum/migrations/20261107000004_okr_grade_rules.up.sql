CREATE TABLE IF NOT EXISTS "okr_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "okr_grade_id" uuid NOT NULL,
    "rule_id" text NOT NULL DEFAULT '',
    "instrument" text NOT NULL DEFAULT '',
    "grade" text NOT NULL DEFAULT '',
    "category" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-okr_grade_rules-okr_grade_id-to-okr_grades" FOREIGN KEY ("okr_grade_id") REFERENCES "okr_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE okr_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
