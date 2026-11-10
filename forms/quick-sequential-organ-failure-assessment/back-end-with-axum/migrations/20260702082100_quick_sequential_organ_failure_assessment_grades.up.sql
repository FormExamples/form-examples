CREATE TABLE IF NOT EXISTS "quick_sequential_organ_failure_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "respiratory_rate_point" integer NULL,
    "mentation_point" integer NULL,
    "systolic_blood_pressure_point" integer NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "threshold_met" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "quick_sequential_organ_failure_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-quick_sequential_organ_failure_assessment_grades-quick_sequential_organ_failure_assessment_id-to-quick_sequential_organ_failure_assessments" FOREIGN KEY ("quick_sequential_organ_failure_assessment_id") REFERENCES "quick_sequential_organ_failure_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE quick_sequential_organ_failure_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
