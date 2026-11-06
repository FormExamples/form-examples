CREATE TABLE IF NOT EXISTS "medication_reconciliations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "reconciliation_type" varchar NOT NULL DEFAULT '',
    "care_setting" varchar NOT NULL DEFAULT '',
    "reconciled_at" timestamp with time zone NULL,
    "clinician_name" text NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "patient_identifier" text NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "weight_kg" double precision NULL,
    "allergy_status" varchar NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-medication_reconciliations-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-medication_reconciliations-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE medication_reconciliations ALTER COLUMN id SET DEFAULT gen_random_uuid();
