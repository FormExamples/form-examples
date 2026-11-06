CREATE TABLE IF NOT EXISTS "medical_conditions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "has_diabetes" varchar NOT NULL DEFAULT '',
    "has_atrial_fibrillation" varchar NOT NULL DEFAULT '',
    "has_rheumatoid_arthritis" varchar NOT NULL DEFAULT '',
    "has_chronic_kidney_disease" varchar NOT NULL DEFAULT '',
    "has_migraine" varchar NOT NULL DEFAULT '',
    "has_severe_mental_illness" varchar NOT NULL DEFAULT '',
    "has_erectile_dysfunction" varchar NOT NULL DEFAULT '',
    "on_atypical_antipsychotic" varchar NOT NULL DEFAULT '',
    "on_corticosteroids" varchar NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_conditions-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_conditions ALTER COLUMN id SET DEFAULT gen_random_uuid();
