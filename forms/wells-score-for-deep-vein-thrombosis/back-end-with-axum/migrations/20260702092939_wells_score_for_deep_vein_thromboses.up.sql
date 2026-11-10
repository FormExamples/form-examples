CREATE TABLE IF NOT EXISTS "wells_score_for_deep_vein_thromboses" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "symptomatic_leg" varchar NOT NULL DEFAULT '',
    "active_cancer" varchar NOT NULL DEFAULT '',
    "paralysis_or_immobilisation" varchar NOT NULL DEFAULT '',
    "recently_bedridden_or_surgery" varchar NOT NULL DEFAULT '',
    "localised_tenderness" varchar NOT NULL DEFAULT '',
    "entire_leg_swollen" varchar NOT NULL DEFAULT '',
    "calf_swelling_over_3cm" varchar NOT NULL DEFAULT '',
    "pitting_oedema" varchar NOT NULL DEFAULT '',
    "collateral_superficial_veins" varchar NOT NULL DEFAULT '',
    "previously_documented_dvt" varchar NOT NULL DEFAULT '',
    "alternative_diagnosis_as_likely" varchar NOT NULL DEFAULT '',
    "clinical_notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-wells_score_for_deep_vein_thromboses-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-wells_score_for_deep_vein_thromboses-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE wells_score_for_deep_vein_thromboses ALTER COLUMN id SET DEFAULT gen_random_uuid();
