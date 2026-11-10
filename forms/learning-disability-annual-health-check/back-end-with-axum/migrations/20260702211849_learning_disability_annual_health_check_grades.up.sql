CREATE TABLE IF NOT EXISTS "learning_disability_annual_health_check_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "health_action_plan_complete" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "learning_disability_annual_health_check_id" uuid NOT NULL,
    CONSTRAINT "fk-learning_disability_annual_health_check_grades-learning_disability_annual_health_check_id-to-learning_disability_annual_health_checks" FOREIGN KEY ("learning_disability_annual_health_check_id") REFERENCES "learning_disability_annual_health_checks" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE learning_disability_annual_health_check_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
