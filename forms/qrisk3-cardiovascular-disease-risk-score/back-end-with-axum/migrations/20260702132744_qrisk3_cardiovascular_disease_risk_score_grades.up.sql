CREATE TABLE IF NOT EXISTS "qrisk3_cardiovascular_disease_risk_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ten_year_risk_percent" double precision NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "heart_age" double precision NULL,
    "linear_predictor" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "qrisk3_cardiovascular_disease_risk_score_id" uuid NOT NULL,
    CONSTRAINT "fk-qrisk3_cardiovascular_disease_risk_score_grades-qrisk3_cardiovascular_disease_risk_score_id-to-qrisk3_cardiovascular_disease_risk_scores" FOREIGN KEY ("qrisk3_cardiovascular_disease_risk_score_id") REFERENCES "qrisk3_cardiovascular_disease_risk_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE qrisk3_cardiovascular_disease_risk_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
