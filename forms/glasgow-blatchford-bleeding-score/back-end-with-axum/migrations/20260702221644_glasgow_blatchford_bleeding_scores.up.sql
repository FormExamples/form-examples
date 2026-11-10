CREATE TABLE IF NOT EXISTS "glasgow_blatchford_bleeding_scores" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "presenting_complaint" varchar NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "blood_urea_mmol_l" double precision NULL,
    "haemoglobin_g_l" double precision NULL,
    "systolic_blood_pressure_mmhg" integer NULL,
    "pulse_beats_per_min" integer NULL,
    "melaena_present" varchar NOT NULL DEFAULT '',
    "syncope" varchar NOT NULL DEFAULT '',
    "hepatic_disease" varchar NOT NULL DEFAULT '',
    "cardiac_failure" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-glasgow_blatchford_bleeding_scores-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-glasgow_blatchford_bleeding_scores-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE glasgow_blatchford_bleeding_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();
