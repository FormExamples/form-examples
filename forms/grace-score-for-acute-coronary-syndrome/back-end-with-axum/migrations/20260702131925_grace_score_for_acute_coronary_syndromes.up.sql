CREATE TABLE IF NOT EXISTS "grace_score_for_acute_coronary_syndromes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "presentation_type" varchar NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_years" integer NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "heart_rate" integer NULL,
    "systolic_blood_pressure" integer NULL,
    "serum_creatinine" double precision NULL,
    "serum_creatinine_unit" varchar NOT NULL DEFAULT '',
    "killip_class" varchar NOT NULL DEFAULT '',
    "cardiac_arrest_at_admission" varchar NOT NULL DEFAULT '',
    "st_segment_deviation" varchar NOT NULL DEFAULT '',
    "elevated_cardiac_enzymes" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-grace_score_for_acute_coronary_syndromes-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-grace_score_for_acute_coronary_syndromes-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE grace_score_for_acute_coronary_syndromes ALTER COLUMN id SET DEFAULT gen_random_uuid();
