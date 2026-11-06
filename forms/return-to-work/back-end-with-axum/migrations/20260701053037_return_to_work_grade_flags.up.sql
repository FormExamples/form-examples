CREATE TABLE IF NOT EXISTS "return_to_work_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_code" varchar NOT NULL DEFAULT '',
    "flag_title" varchar NOT NULL DEFAULT '',
    "flag_category" varchar NOT NULL DEFAULT '',
    "flag_priority" varchar NOT NULL DEFAULT '',
    "flag_evidence" text NOT NULL DEFAULT '',
    "flag_recommendation" text NOT NULL DEFAULT '',
    "return_to_work_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-return_to_work_grade_flags-return_to_work_grade_id-to-return_to_work_grades" FOREIGN KEY ("return_to_work_grade_id") REFERENCES "return_to_work_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE return_to_work_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
