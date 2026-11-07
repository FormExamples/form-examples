CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "severity_level" varchar NOT NULL DEFAULT 'mild',
    "total_symptom_score" integer NOT NULL DEFAULT 0,
    "menstrual_domain_score" integer NOT NULL DEFAULT 0,
    "pelvic_symptom_score" integer NOT NULL DEFAULT 0,
    "urogenital_symptom_score" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
