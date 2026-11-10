CREATE TABLE IF NOT EXISTS "toxicology_test_result_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "toxicology_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-toxicology_test_result_grade_rules-toxicology_test_result_grade_id-to-toxicology_test_result_grades" FOREIGN KEY ("toxicology_test_result_grade_id") REFERENCES "toxicology_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE toxicology_test_result_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
