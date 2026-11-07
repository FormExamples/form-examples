CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "gaf_score" integer NOT NULL DEFAULT 0,
    "gaf_category" varchar NOT NULL DEFAULT '',
    "symptom_severity" varchar NOT NULL DEFAULT '',
    "functional_impairment" varchar NOT NULL DEFAULT '',
    "risk_classification" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
