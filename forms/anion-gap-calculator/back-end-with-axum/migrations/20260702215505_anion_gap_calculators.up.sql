CREATE TABLE IF NOT EXISTS "anion_gap_calculators" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "calculated_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "clinical_context" text NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "sodium_mmol_l" double precision NULL,
    "potassium_mmol_l" double precision NULL,
    "chloride_mmol_l" double precision NULL,
    "bicarbonate_mmol_l" double precision NULL,
    "albumin_g_l" double precision NULL,
    "include_potassium" varchar NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-anion_gap_calculators-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-anion_gap_calculators-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anion_gap_calculators ALTER COLUMN id SET DEFAULT gen_random_uuid();
