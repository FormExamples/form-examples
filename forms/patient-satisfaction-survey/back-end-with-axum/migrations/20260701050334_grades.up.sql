CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "normalized_score" double precision NOT NULL DEFAULT 0,
    "satisfaction_category" varchar NOT NULL DEFAULT '',
    "domain_access_score" double precision NULL,
    "domain_communication_score" double precision NULL,
    "domain_clinical_care_score" double precision NULL,
    "domain_staff_score" double precision NULL,
    "domain_environment_score" double precision NULL,
    "domain_discharge_score" double precision NULL,
    "domain_overall_score" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
