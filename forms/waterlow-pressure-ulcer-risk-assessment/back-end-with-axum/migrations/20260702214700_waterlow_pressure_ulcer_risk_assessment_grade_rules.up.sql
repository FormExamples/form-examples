CREATE TABLE IF NOT EXISTS "waterlow_pressure_ulcer_risk_assessment_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL,
    "points" integer NULL,
    "label" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "waterlow_pressure_ulcer_risk_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-waterlow_pressure_ulcer_risk_assessment_grade_rules-waterlow_pressure_ulcer_risk_assessment_grade_id-to-waterlow_pressure_ulcer_risk_assessment_grades" FOREIGN KEY ("waterlow_pressure_ulcer_risk_assessment_grade_id") REFERENCES "waterlow_pressure_ulcer_risk_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE waterlow_pressure_ulcer_risk_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
