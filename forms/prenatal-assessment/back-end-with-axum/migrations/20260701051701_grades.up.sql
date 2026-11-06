CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "risk_level" varchar NOT NULL DEFAULT 'low',
    "risk_score" integer NOT NULL DEFAULT 0,
    "obstetric_risk" varchar NOT NULL DEFAULT '',
    "medical_risk" varchar NOT NULL DEFAULT '',
    "mental_health_risk" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
