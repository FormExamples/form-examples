CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eligibility" varchar NOT NULL DEFAULT '',
    "overall_risk_level" varchar NOT NULL DEFAULT '',
    "hla_match_level" varchar NOT NULL DEFAULT '',
    "collection_method" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "bone_marrow_donation_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-bone_marrow_donation_assessment_id-to-bone_marrow_donation_assessments" FOREIGN KEY ("bone_marrow_donation_assessment_id") REFERENCES "bone_marrow_donation_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
