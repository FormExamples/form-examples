CREATE TABLE IF NOT EXISTS "cardiac_stress_test_result_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "cardiac_stress_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cardiac_stress_test_result_grade_flags-cardiac_stress_test_result_grade_id-to-cardiac_stress_test_result_grades" FOREIGN KEY ("cardiac_stress_test_result_grade_id") REFERENCES "cardiac_stress_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cardiac_stress_test_result_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
