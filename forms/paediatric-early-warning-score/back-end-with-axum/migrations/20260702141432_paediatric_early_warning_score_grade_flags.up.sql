CREATE TABLE IF NOT EXISTS "paediatric_early_warning_score_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "paediatric_early_warning_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-paediatric_early_warning_score_grade_flags-paediatric_early_warning_score_grade_id-to-paediatric_early_warning_score_grades" FOREIGN KEY ("paediatric_early_warning_score_grade_id") REFERENCES "paediatric_early_warning_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE paediatric_early_warning_score_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
