CREATE TABLE IF NOT EXISTS "cytology_test_request_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "cytology_test_request_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cytology_test_request_grade_rules-cytology_test_request_grade_id-to-cytology_test_request_grades" FOREIGN KEY ("cytology_test_request_grade_id") REFERENCES "cytology_test_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cytology_test_request_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
