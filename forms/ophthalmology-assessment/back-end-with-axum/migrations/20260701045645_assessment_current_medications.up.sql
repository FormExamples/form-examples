CREATE TABLE IF NOT EXISTS "assessment_current_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "has_ocular_medications" varchar NOT NULL DEFAULT '',
    "has_systemic_medications" varchar NOT NULL DEFAULT '',
    "medication_allergies" text NOT NULL DEFAULT '',
    "medications_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_current_medications-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
