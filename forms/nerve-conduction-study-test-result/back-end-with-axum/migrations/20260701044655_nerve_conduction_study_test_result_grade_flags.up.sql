CREATE TABLE IF NOT EXISTS "nerve_conduction_study_test_result_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "nerve_conduction_study_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-nerve_conduction_study_test_result_grade_flags-nerve_conduction_study_test_result_grade_id-to-nerve_conduction_study_test_result_grades" FOREIGN KEY ("nerve_conduction_study_test_result_grade_id") REFERENCES "nerve_conduction_study_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nerve_conduction_study_test_result_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
