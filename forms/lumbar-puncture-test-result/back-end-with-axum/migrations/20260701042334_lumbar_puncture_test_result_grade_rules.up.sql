CREATE TABLE IF NOT EXISTS "lumbar_puncture_test_result_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "lumbar_puncture_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-lumbar_puncture_test_result_grade_rules-lumbar_puncture_test_result_grade_id-to-lumbar_puncture_test_result_grades" FOREIGN KEY ("lumbar_puncture_test_result_grade_id") REFERENCES "lumbar_puncture_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lumbar_puncture_test_result_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
