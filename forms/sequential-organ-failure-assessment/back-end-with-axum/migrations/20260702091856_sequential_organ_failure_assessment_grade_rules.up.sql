CREATE TABLE IF NOT EXISTS "sequential_organ_failure_assessment_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "parameter" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "sequential_organ_failure_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-sequential_organ_failure_assessment_grade_rules-sequential_organ_failure_assessment_grade_id-to-sequential_organ_failure_assessment_grades" FOREIGN KEY ("sequential_organ_failure_assessment_grade_id") REFERENCES "sequential_organ_failure_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE sequential_organ_failure_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
