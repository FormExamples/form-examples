CREATE TABLE IF NOT EXISTS "paediatric_early_warning_scores" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "observation_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "respiratory_rate" integer NULL,
    "respiratory_effort" varchar NOT NULL DEFAULT '',
    "oxygen_saturation" integer NULL,
    "supplemental_oxygen" varchar NOT NULL DEFAULT '',
    "heart_rate" integer NULL,
    "capillary_refill" varchar NOT NULL DEFAULT '',
    "consciousness_acvpu" varchar NOT NULL DEFAULT '',
    "nurse_concern" varchar NOT NULL DEFAULT '',
    "parent_concern" varchar NOT NULL DEFAULT '',
    "clinical_notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-paediatric_early_warning_scores-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-paediatric_early_warning_scores-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE paediatric_early_warning_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();
