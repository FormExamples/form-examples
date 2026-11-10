CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "dmft_score" integer NOT NULL DEFAULT 0,
    "decayed_count" integer NOT NULL DEFAULT 0,
    "missing_count" integer NOT NULL DEFAULT 0,
    "filled_count" integer NOT NULL DEFAULT 0,
    "severity_level" varchar NOT NULL DEFAULT 'very_low',
    "periodontal_risk" varchar NOT NULL DEFAULT 'low',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
