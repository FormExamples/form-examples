CREATE TABLE IF NOT EXISTS "agile_consulting_scorecard_for_hiring_help_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "agile_consulting_scorecard_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-agile_consulting_scorecard_for_hiring_help_grade_flags-agile_consulting_scorecard_grade_id-to-agile_consulting_scorecard_for_hiring_help_grades" FOREIGN KEY ("agile_consulting_scorecard_grade_id") REFERENCES "agile_consulting_scorecard_for_hiring_help_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_consulting_scorecard_for_hiring_help_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
