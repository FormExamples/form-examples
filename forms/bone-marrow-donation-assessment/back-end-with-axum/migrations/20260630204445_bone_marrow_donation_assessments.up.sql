CREATE TABLE IF NOT EXISTS "bone_marrow_donation_assessments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "status" varchar NOT NULL DEFAULT 'draft',
    "patient_id" uuid NOT NULL,
    CONSTRAINT "fk-bone_marrow_donation_assessments-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE bone_marrow_donation_assessments ALTER COLUMN id SET DEFAULT gen_random_uuid();
