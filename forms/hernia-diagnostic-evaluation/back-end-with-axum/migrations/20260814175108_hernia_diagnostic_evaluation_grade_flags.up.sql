CREATE TABLE IF NOT EXISTS "hernia_diagnostic_evaluation_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "hernia_diagnostic_evaluation_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-hernia_diagnostic_evaluation_grade_flags-hernia_diagnostic_evaluation_grade_id-to-hernia_diagnostic_evaluation_grades" FOREIGN KEY ("hernia_diagnostic_evaluation_grade_id") REFERENCES "hernia_diagnostic_evaluation_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hernia_diagnostic_evaluation_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
