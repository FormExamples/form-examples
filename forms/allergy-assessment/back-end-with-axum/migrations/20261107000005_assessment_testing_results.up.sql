CREATE TABLE IF NOT EXISTS "assessment_testing_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "skin_prick_tests_done" varchar NOT NULL DEFAULT '',
    "specific_ige_done" varchar NOT NULL DEFAULT '',
    "component_resolved_diagnostics_done" varchar NOT NULL DEFAULT '',
    "challenge_tests_done" varchar NOT NULL DEFAULT '',
    "patch_tests_done" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_testing_results-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_testing_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
