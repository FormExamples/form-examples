CREATE TABLE IF NOT EXISTS "curb_65_pneumonia_severity_score_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "curb_65_pneumonia_severity_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-curb_65_pneumonia_severity_score_grade_flags-curb_65_pneumonia_severity_score_grade_id-to-curb_65_pneumonia_severity_score_grades" FOREIGN KEY ("curb_65_pneumonia_severity_score_grade_id") REFERENCES "curb_65_pneumonia_severity_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE curb_65_pneumonia_severity_score_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
