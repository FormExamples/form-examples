CREATE TABLE IF NOT EXISTS "wells_score_for_pulmonary_embolisms" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "haemodynamic_status" varchar NOT NULL DEFAULT '',
    "clinical_signs_of_dvt" varchar NOT NULL DEFAULT '',
    "pe_most_likely" varchar NOT NULL DEFAULT '',
    "heart_rate_over_100" varchar NOT NULL DEFAULT '',
    "immobilisation_or_surgery" varchar NOT NULL DEFAULT '',
    "previous_dvt_pe" varchar NOT NULL DEFAULT '',
    "haemoptysis" varchar NOT NULL DEFAULT '',
    "malignancy" varchar NOT NULL DEFAULT '',
    "clinical_notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-wells_score_for_pulmonary_embolisms-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-wells_score_for_pulmonary_embolisms-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE wells_score_for_pulmonary_embolisms ALTER COLUMN id SET DEFAULT gen_random_uuid();
