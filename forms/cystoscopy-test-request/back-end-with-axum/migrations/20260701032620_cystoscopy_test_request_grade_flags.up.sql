CREATE TABLE IF NOT EXISTS "cystoscopy_test_request_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "cystoscopy_test_request_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cystoscopy_test_request_grade_flags-cystoscopy_test_request_grade_id-to-cystoscopy_test_request_grades" FOREIGN KEY ("cystoscopy_test_request_grade_id") REFERENCES "cystoscopy_test_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cystoscopy_test_request_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
