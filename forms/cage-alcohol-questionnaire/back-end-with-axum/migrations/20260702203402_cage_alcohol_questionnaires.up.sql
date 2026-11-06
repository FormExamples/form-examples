CREATE TABLE IF NOT EXISTS "cage_alcohol_questionnaires" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "cut_down" varchar NOT NULL DEFAULT '',
    "annoyed" varchar NOT NULL DEFAULT '',
    "guilty" varchar NOT NULL DEFAULT '',
    "eye_opener" varchar NOT NULL DEFAULT '',
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-cage_alcohol_questionnaires-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-cage_alcohol_questionnaires-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE cage_alcohol_questionnaires ALTER COLUMN id SET DEFAULT gen_random_uuid();
