CREATE TABLE IF NOT EXISTS "child_pugh_scores" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "aetiology" varchar NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "total_bilirubin_umol_l" double precision NULL,
    "serum_albumin_g_l" double precision NULL,
    "inr" double precision NULL,
    "prothrombin_time_seconds" double precision NULL,
    "ascites" varchar NOT NULL DEFAULT '',
    "hepatic_encephalopathy" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-child_pugh_scores-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-child_pugh_scores-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE child_pugh_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();
