CREATE TABLE IF NOT EXISTS "eye_prescriptions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "patient_id" uuid NOT NULL,
    "prescriber_id" uuid NOT NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "examination_date" date NOT NULL,
    "examination_time" time NULL,
    "issue_date" date NOT NULL,
    "expiry_date" date NOT NULL,
    "reason_for_sight_test" varchar NOT NULL DEFAULT '',
    "prior_prescription_on_file" boolean NOT NULL DEFAULT FALSE,
    "prior_prescription_date" date NULL,
    "notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescriptions-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk-eye_prescriptions-prescriber_id-to-prescribers" FOREIGN KEY ("prescriber_id") REFERENCES "prescribers" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE eye_prescriptions ALTER COLUMN id SET DEFAULT gen_random_uuid();
