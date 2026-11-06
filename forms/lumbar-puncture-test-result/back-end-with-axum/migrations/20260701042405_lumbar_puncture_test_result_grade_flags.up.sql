CREATE TABLE IF NOT EXISTS "lumbar_puncture_test_result_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "lumbar_puncture_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-lumbar_puncture_test_result_grade_flags-lumbar_puncture_test_result_grade_id-to-lumbar_puncture_test_result_grades" FOREIGN KEY ("lumbar_puncture_test_result_grade_id") REFERENCES "lumbar_puncture_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lumbar_puncture_test_result_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
