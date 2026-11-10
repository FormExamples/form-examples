CREATE TABLE IF NOT EXISTS "outpatient_outcome_encounters" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinic_date" date NULL,
    "specialty" varchar NOT NULL DEFAULT '',
    "modality" varchar NOT NULL DEFAULT '',
    "appointment_type" varchar NOT NULL DEFAULT '',
    "outpatient_outcome_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-outpatient_outcome_encounters-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-outpatient_outcome_encounters-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_encounters ALTER COLUMN id SET DEFAULT gen_random_uuid();
