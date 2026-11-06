CREATE TABLE IF NOT EXISTS "confusion_assessment_method_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "feature" varchar NOT NULL,
    "positive" boolean NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "confusion_assessment_method_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-confusion_assessment_method_grade_rules-confusion_assessment_method_grade_id-to-confusion_assessment_method_grades" FOREIGN KEY ("confusion_assessment_method_grade_id") REFERENCES "confusion_assessment_method_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE confusion_assessment_method_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
