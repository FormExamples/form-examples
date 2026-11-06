CREATE TABLE IF NOT EXISTS "caprini_venous_thromboembolism_risk_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "prophylaxis_recommendation" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "caprini_venous_thromboembolism_risk_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-caprini_venous_thromboembolism_risk_assessment_grades-caprini_venous_thromboembolism_risk_assessment_id-to-caprini_venous_thromboembolism_risk_assessments" FOREIGN KEY ("caprini_venous_thromboembolism_risk_assessment_id") REFERENCES "caprini_venous_thromboembolism_risk_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE caprini_venous_thromboembolism_risk_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
