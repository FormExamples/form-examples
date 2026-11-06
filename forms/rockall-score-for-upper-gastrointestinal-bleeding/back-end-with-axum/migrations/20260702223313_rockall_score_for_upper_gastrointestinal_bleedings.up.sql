CREATE TABLE IF NOT EXISTS "rockall_score_for_upper_gastrointestinal_bleedings" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "presenting_complaint" text NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_years" integer NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "systolic_blood_pressure_mmhg" integer NULL,
    "heart_rate_bpm" integer NULL,
    "comorbidity" varchar NOT NULL DEFAULT '',
    "endoscopy_performed" varchar NOT NULL DEFAULT '',
    "diagnosis" varchar NOT NULL DEFAULT '',
    "stigmata_recent_haemorrhage" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-rockall_score_for_upper_gastrointestinal_bleedings-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-rockall_score_for_upper_gastrointestinal_bleedings-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE rockall_score_for_upper_gastrointestinal_bleedings ALTER COLUMN id SET DEFAULT gen_random_uuid();
