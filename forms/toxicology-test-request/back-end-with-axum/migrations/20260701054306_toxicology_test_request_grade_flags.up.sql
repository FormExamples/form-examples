CREATE TABLE IF NOT EXISTS "toxicology_test_request_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "toxicology_test_request_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-toxicology_test_request_grade_flags-toxicology_test_request_grade_id-to-toxicology_test_request_grades" FOREIGN KEY ("toxicology_test_request_grade_id") REFERENCES "toxicology_test_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE toxicology_test_request_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
