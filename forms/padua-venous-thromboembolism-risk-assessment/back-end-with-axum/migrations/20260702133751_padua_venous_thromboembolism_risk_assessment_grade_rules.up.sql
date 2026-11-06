CREATE TABLE IF NOT EXISTS "padua_venous_thromboembolism_risk_assessment_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "factor" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "padua_venous_thromboembolism_risk_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-padua_venous_thromboembolism_risk_assessment_grade_rules-padua_venous_thromboembolism_risk_assessment_grade_id-to-padua_venous_thromboembolism_risk_assessment_grades" FOREIGN KEY ("padua_venous_thromboembolism_risk_assessment_grade_id") REFERENCES "padua_venous_thromboembolism_risk_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE padua_venous_thromboembolism_risk_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
