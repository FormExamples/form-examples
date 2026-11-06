CREATE TABLE IF NOT EXISTS "cha2ds2_vascs" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "atrial_fibrillation_type" varchar NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_years" integer NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "congestive_heart_failure" varchar NOT NULL DEFAULT '',
    "hypertension" varchar NOT NULL DEFAULT '',
    "diabetes" varchar NOT NULL DEFAULT '',
    "stroke_tia_thromboembolism" varchar NOT NULL DEFAULT '',
    "vascular_disease" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-cha2ds2_vascs-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-cha2ds2_vascs-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE cha2ds2_vascs ALTER COLUMN id SET DEFAULT gen_random_uuid();
