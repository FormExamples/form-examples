CREATE TABLE IF NOT EXISTS "hearing_test_request_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "hearing_test_request_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-hearing_test_request_grade_flags-hearing_test_request_grade_id-to-hearing_test_request_grades" FOREIGN KEY ("hearing_test_request_grade_id") REFERENCES "hearing_test_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hearing_test_request_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
