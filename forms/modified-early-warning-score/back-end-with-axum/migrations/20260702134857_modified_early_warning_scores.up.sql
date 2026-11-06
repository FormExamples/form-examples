CREATE TABLE IF NOT EXISTS "modified_early_warning_scores" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "observation_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "ward_or_location" varchar NOT NULL DEFAULT '',
    "systolic_blood_pressure" integer NULL,
    "heart_rate" integer NULL,
    "respiratory_rate" integer NULL,
    "temperature" double precision NULL,
    "consciousness_avpu" varchar NOT NULL DEFAULT '',
    "previous_mews_score" integer NULL,
    "clinical_notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-modified_early_warning_scores-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-modified_early_warning_scores-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE modified_early_warning_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();
