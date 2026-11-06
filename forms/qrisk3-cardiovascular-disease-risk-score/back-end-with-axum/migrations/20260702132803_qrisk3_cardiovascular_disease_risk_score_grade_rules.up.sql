CREATE TABLE IF NOT EXISTS "qrisk3_cardiovascular_disease_risk_score_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "component" varchar NOT NULL,
    "contribution" double precision NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "qrisk3_cardiovascular_disease_risk_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-qrisk3_cardiovascular_disease_risk_score_grade_rules-qrisk3_cardiovascular_disease_risk_score_grade_id-to-qrisk3_cardiovascular_disease_risk_score_grades" FOREIGN KEY ("qrisk3_cardiovascular_disease_risk_score_grade_id") REFERENCES "qrisk3_cardiovascular_disease_risk_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE qrisk3_cardiovascular_disease_risk_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
