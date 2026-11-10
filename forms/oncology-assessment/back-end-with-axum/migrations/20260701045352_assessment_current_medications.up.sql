CREATE TABLE IF NOT EXISTS "assessment_current_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "polypharmacy_concern" varchar NOT NULL DEFAULT '',
    "drug_interactions_identified" varchar NOT NULL DEFAULT '',
    "drug_interaction_details" text NOT NULL DEFAULT '',
    "complementary_medicines" varchar NOT NULL DEFAULT '',
    "complementary_medicine_details" text NOT NULL DEFAULT '',
    "medication_adherence" varchar NOT NULL DEFAULT '',
    "medications_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_current_medications-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
