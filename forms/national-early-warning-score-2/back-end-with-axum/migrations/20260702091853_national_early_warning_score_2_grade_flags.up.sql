CREATE TABLE IF NOT EXISTS "national_early_warning_score_2_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "national_early_warning_score_2_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-national_early_warning_score_2_grade_flags-national_early_warning_score_2_grade_id-to-national_early_warning_score_2_grades" FOREIGN KEY ("national_early_warning_score_2_grade_id") REFERENCES "national_early_warning_score_2_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE national_early_warning_score_2_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
