CREATE TABLE IF NOT EXISTS "four_a_test_for_deliriums" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "patient_name" varchar NOT NULL DEFAULT '',
    "date_of_birth" date NULL,
    "assessment_date" date NULL,
    "assessment_time" time NULL,
    "setting" varchar NOT NULL DEFAULT '',
    "assessor_name" varchar NOT NULL DEFAULT '',
    "assessor_role" varchar NOT NULL DEFAULT '',
    "alertness" varchar NOT NULL DEFAULT '',
    "amt4" varchar NOT NULL DEFAULT '',
    "attention_months" varchar NOT NULL DEFAULT '',
    "acute_change" varchar NOT NULL DEFAULT '',
    "acute_change_source" varchar NOT NULL DEFAULT '',
    "clinical_notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-four_a_test_for_deliriums-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-four_a_test_for_deliriums-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE four_a_test_for_deliriums ALTER COLUMN id SET DEFAULT gen_random_uuid();
