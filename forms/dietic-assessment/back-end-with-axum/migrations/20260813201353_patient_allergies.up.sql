CREATE TABLE IF NOT EXISTS "patient_allergies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "reaction" text NOT NULL DEFAULT '',
    "severity" text NOT NULL DEFAULT '',
    "kind" text NOT NULL DEFAULT '',
    "diagnosis_method" text NOT NULL DEFAULT '',
    "onset_on" date NULL,
    "adrenaline_auto_injector" boolean NOT NULL DEFAULT false,
    "notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "allergy_id" uuid NOT NULL,
    CONSTRAINT "fk-patient_allergies-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-patient_allergies-allergy_id-to-allergies" FOREIGN KEY ("allergy_id") REFERENCES "allergies" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE patient_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid();
