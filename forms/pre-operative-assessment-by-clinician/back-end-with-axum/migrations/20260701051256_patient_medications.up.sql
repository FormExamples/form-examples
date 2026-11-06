CREATE TABLE IF NOT EXISTS "patient_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "patient_id" uuid NOT NULL,
    "medication_id" uuid NOT NULL,
    CONSTRAINT "fk-patient_medications-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-patient_medications-medication_id-to-medications" FOREIGN KEY ("medication_id") REFERENCES "medications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE patient_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
