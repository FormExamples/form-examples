CREATE TABLE IF NOT EXISTS "caprini_venous_thromboembolism_risk_assessment_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "factor" varchar NOT NULL DEFAULT '',
    "weight_group" varchar NOT NULL DEFAULT '',
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "caprini_venous_thromboembolism_risk_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-caprini_venous_thromboembolism_risk_assessment_grade_rules-caprini_venous_thromboembolism_risk_assessment_grade_id-to-caprini_venous_thromboembolism_risk_assessment_grades" FOREIGN KEY ("caprini_venous_thromboembolism_risk_assessment_grade_id") REFERENCES "caprini_venous_thromboembolism_risk_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE caprini_venous_thromboembolism_risk_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
