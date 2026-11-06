CREATE TABLE IF NOT EXISTS "assessment_cancer_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "family_cancer_history" varchar NOT NULL DEFAULT '',
    "multiple_family_cancers" varchar NOT NULL DEFAULT '',
    "early_onset_cancer" varchar NOT NULL DEFAULT '',
    "bilateral_cancer" varchar NOT NULL DEFAULT '',
    "rare_tumour_types" varchar NOT NULL DEFAULT '',
    "rare_tumour_details" text NOT NULL DEFAULT '',
    "known_cancer_syndrome" varchar NOT NULL DEFAULT '',
    "cancer_syndrome_details" text NOT NULL DEFAULT '',
    "cancer_risk_score" integer NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_cancer_histories-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_cancer_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
