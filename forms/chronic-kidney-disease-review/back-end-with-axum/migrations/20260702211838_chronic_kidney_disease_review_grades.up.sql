CREATE TABLE IF NOT EXISTS "chronic_kidney_disease_review_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "gfr_category" varchar NOT NULL DEFAULT '',
    "albuminuria_category" varchar NOT NULL DEFAULT '',
    "kdigo_risk_zone" varchar NOT NULL DEFAULT '',
    "review_status" varchar NOT NULL DEFAULT '',
    "blood_pressure_target_systolic" integer NULL,
    "blood_pressure_target_diastolic" integer NULL,
    "blood_pressure_at_target" boolean NULL,
    "completeness_score" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "chronic_kidney_disease_review_id" uuid NOT NULL,
    CONSTRAINT "fk-chronic_kidney_disease_review_grades-chronic_kidney_disease_review_id-to-chronic_kidney_disease_reviews" FOREIGN KEY ("chronic_kidney_disease_review_id") REFERENCES "chronic_kidney_disease_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE chronic_kidney_disease_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
