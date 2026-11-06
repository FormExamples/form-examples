CREATE TABLE IF NOT EXISTS "timi_risk_score_for_acute_coronary_syndromes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "working_diagnosis" varchar NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "age_over_65" varchar NOT NULL DEFAULT '',
    "three_or_more_cad_risk_factors" varchar NOT NULL DEFAULT '',
    "known_cad_stenosis" varchar NOT NULL DEFAULT '',
    "aspirin_use_prior_7_days" varchar NOT NULL DEFAULT '',
    "two_or_more_angina_episodes_24h" varchar NOT NULL DEFAULT '',
    "st_deviation" varchar NOT NULL DEFAULT '',
    "positive_cardiac_marker" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-timi_risk_score_for_acute_coronary_syndromes-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-timi_risk_score_for_acute_coronary_syndromes-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE timi_risk_score_for_acute_coronary_syndromes ALTER COLUMN id SET DEFAULT gen_random_uuid();
