CREATE TABLE IF NOT EXISTS "okr_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "okr_grade_id" uuid NOT NULL,
    "flag_code" text NOT NULL DEFAULT '',
    "priority" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-okr_grade_flags-okr_grade_id-to-okr_grades" FOREIGN KEY ("okr_grade_id") REFERENCES "okr_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE okr_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
