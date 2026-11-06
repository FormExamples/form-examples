CREATE TABLE IF NOT EXISTS "electrocardiogram_test_result_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "electrocardiogram_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-electrocardiogram_test_result_grade_rules-electrocardiogram_test_result_grade_id-to-electrocardiogram_test_result_grades" FOREIGN KEY ("electrocardiogram_test_result_grade_id") REFERENCES "electrocardiogram_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE electrocardiogram_test_result_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
