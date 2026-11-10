CREATE TABLE IF NOT EXISTS "waterlow_pressure_ulcer_risk_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "build_points" integer NULL,
    "skin_points" integer NULL,
    "sex_points" integer NULL,
    "age_points" integer NULL,
    "continence_points" integer NULL,
    "mobility_points" integer NULL,
    "tissue_malnutrition_points" integer NULL,
    "neurological_deficit_points" integer NULL,
    "major_surgery_trauma_points" integer NULL,
    "medication_points" integer NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "prevention_actions" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "waterlow_pressure_ulcer_risk_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-waterlow_pressure_ulcer_risk_assessment_grades-waterlow_pressure_ulcer_risk_assessment_id-to-waterlow_pressure_ulcer_risk_assessments" FOREIGN KEY ("waterlow_pressure_ulcer_risk_assessment_id") REFERENCES "waterlow_pressure_ulcer_risk_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE waterlow_pressure_ulcer_risk_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
