CREATE TABLE IF NOT EXISTS "fluoroscopy_test_request_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "fluoroscopy_test_request_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-fluoroscopy_test_request_grade_rules-fluoroscopy_test_request_grade_id-to-fluoroscopy_test_request_grades" FOREIGN KEY ("fluoroscopy_test_request_grade_id") REFERENCES "fluoroscopy_test_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE fluoroscopy_test_request_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
