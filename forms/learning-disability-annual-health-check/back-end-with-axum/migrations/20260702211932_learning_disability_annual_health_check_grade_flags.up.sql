CREATE TABLE IF NOT EXISTS "learning_disability_annual_health_check_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "learning_disability_annual_health_check_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-learning_disability_annual_health_check_grade_flags-learning_disability_annual_health_check_grade_id-to-learning_disability_annual_health_check_grades" FOREIGN KEY ("learning_disability_annual_health_check_grade_id") REFERENCES "learning_disability_annual_health_check_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE learning_disability_annual_health_check_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
