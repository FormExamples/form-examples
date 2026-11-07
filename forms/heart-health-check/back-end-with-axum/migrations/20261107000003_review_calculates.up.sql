CREATE TABLE IF NOT EXISTS "review_calculates" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "review_date" date NULL,
    "clinical_notes" text NOT NULL DEFAULT '',
    "audit_score" integer NULL,
    CONSTRAINT "fk-review_calculates-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE review_calculates ALTER COLUMN id SET DEFAULT gen_random_uuid();
