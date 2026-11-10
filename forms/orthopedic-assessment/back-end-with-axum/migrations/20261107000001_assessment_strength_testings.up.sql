CREATE TABLE IF NOT EXISTS "assessment_strength_testings" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "grip_strength_affected_kg" double precision NULL,
    "grip_strength_unaffected_kg" double precision NULL,
    "overall_strength_status" varchar NOT NULL DEFAULT '',
    "strength_testing_notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_strength_testings-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_strength_testings ALTER COLUMN id SET DEFAULT gen_random_uuid();
