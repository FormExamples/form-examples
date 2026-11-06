CREATE TABLE IF NOT EXISTS "health_screening_questionnaire_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "health_screening_questionnaire_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-health_screening_questionnaire_grade_flags-health_screening_questionnaire_grade_id-to-health_screening_questionnaire_grades" FOREIGN KEY ("health_screening_questionnaire_grade_id") REFERENCES "health_screening_questionnaire_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE health_screening_questionnaire_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
