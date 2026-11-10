CREATE TABLE IF NOT EXISTS "cataract_diagnostic_evaluation_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "cataract_diagnostic_evaluation_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cataract_diagnostic_evaluation_grade_flags-cataract_diagnostic_evaluation_grade_id-to-cataract_diagnostic_evaluation_grades" FOREIGN KEY ("cataract_diagnostic_evaluation_grade_id") REFERENCES "cataract_diagnostic_evaluation_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cataract_diagnostic_evaluation_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
