CREATE TABLE IF NOT EXISTS "health_screening_questionnaire_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "parq_plus_clearance" varchar NOT NULL DEFAULT '',
    "audit_c_score" integer NULL,
    "audit_c_band" varchar NOT NULL DEFAULT '',
    "computed_risk_band" varchar NOT NULL DEFAULT '',
    "final_risk_band" varchar NOT NULL DEFAULT '',
    "computed_recommendation" varchar NOT NULL DEFAULT '',
    "final_recommendation" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "signed_by_name" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "health_screening_questionnaire_id" uuid NOT NULL,
    CONSTRAINT "fk-health_screening_questionnaire_grades-health_screening_questionnaire_id-to-health_screening_questionnaires" FOREIGN KEY ("health_screening_questionnaire_id") REFERENCES "health_screening_questionnaires" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE health_screening_questionnaire_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
