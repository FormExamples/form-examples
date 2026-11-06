CREATE TABLE IF NOT EXISTS "padua_venous_thromboembolism_risk_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "active_cancer_points" integer NULL,
    "previous_vte_points" integer NULL,
    "reduced_mobility_points" integer NULL,
    "known_thrombophilia_points" integer NULL,
    "recent_trauma_or_surgery_points" integer NULL,
    "elderly_age_points" integer NULL,
    "heart_or_respiratory_failure_points" integer NULL,
    "acute_mi_or_ischaemic_stroke_points" integer NULL,
    "acute_infection_or_rheumatological_points" integer NULL,
    "obesity_points" integer NULL,
    "ongoing_hormonal_treatment_points" integer NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "prophylaxis_recommendation" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "padua_venous_thromboembolism_risk_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-padua_venous_thromboembolism_risk_assessment_grades-padua_venous_thromboembolism_risk_assessment_id-to-padua_venous_thromboembolism_risk_assessments" FOREIGN KEY ("padua_venous_thromboembolism_risk_assessment_id") REFERENCES "padua_venous_thromboembolism_risk_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE padua_venous_thromboembolism_risk_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
