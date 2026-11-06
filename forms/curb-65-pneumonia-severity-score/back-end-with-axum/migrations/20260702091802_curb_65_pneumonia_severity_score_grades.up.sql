CREATE TABLE IF NOT EXISTS "curb_65_pneumonia_severity_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "confusion_score" integer NULL,
    "urea_score" integer NULL,
    "respiratory_rate_score" integer NULL,
    "blood_pressure_score" integer NULL,
    "age_score" integer NULL,
    "total_score" integer NULL,
    "score_variant" varchar NOT NULL DEFAULT '',
    "risk_band" varchar NOT NULL DEFAULT '',
    "recommended_setting" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "curb_65_pneumonia_severity_score_id" uuid NOT NULL,
    CONSTRAINT "fk-curb_65_pneumonia_severity_score_grades-curb_65_pneumonia_severity_score_id-to-curb_65_pneumonia_severity_scores" FOREIGN KEY ("curb_65_pneumonia_severity_score_id") REFERENCES "curb_65_pneumonia_severity_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE curb_65_pneumonia_severity_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
