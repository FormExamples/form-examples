CREATE TABLE IF NOT EXISTS "estimated_glomerular_filtration_rate_calculators" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "equation" varchar NOT NULL DEFAULT 'ckd-epi-2021-creatinine',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "serum_creatinine_umol_l" double precision NULL,
    "age_years" integer NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "specimen_date" date NULL,
    "steady_state" varchar NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-estimated_glomerular_filtration_rate_calculators-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-estimated_glomerular_filtration_rate_calculators-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE estimated_glomerular_filtration_rate_calculators ALTER COLUMN id SET DEFAULT gen_random_uuid();
