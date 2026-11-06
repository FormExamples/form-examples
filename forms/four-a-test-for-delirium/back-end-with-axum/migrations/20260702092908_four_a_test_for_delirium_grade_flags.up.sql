CREATE TABLE IF NOT EXISTS "four_a_test_for_delirium_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "four_a_test_for_delirium_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-four_a_test_for_delirium_grade_flags-four_a_test_for_delirium_grade_id-to-four_a_test_for_delirium_grades" FOREIGN KEY ("four_a_test_for_delirium_grade_id") REFERENCES "four_a_test_for_delirium_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE four_a_test_for_delirium_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
