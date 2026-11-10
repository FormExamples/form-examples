CREATE TABLE IF NOT EXISTS "timi_risk_score_for_acute_coronary_syndrome_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "criterion" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "timi_risk_score_for_acute_coronary_syndrome_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-timi_risk_score_for_acute_coronary_syndrome_grade_rules-timi_risk_score_for_acute_coronary_syndrome_grade_id-to-timi_risk_score_for_acute_coronary_syndrome_grades" FOREIGN KEY ("timi_risk_score_for_acute_coronary_syndrome_grade_id") REFERENCES "timi_risk_score_for_acute_coronary_syndrome_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE timi_risk_score_for_acute_coronary_syndrome_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
