CREATE TABLE IF NOT EXISTS "diabetes_podiatry_assessment_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "diabetes_podiatry_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-diabetes_podiatry_assessment_grade_flags-diabetes_podiatry_assessment_grade_id-to-diabetes_podiatry_assessment_grades" FOREIGN KEY ("diabetes_podiatry_assessment_grade_id") REFERENCES "diabetes_podiatry_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE diabetes_podiatry_assessment_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
