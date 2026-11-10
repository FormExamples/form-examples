CREATE TABLE IF NOT EXISTS "apgar_scores" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "born_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "gestational_age_weeks" double precision NULL,
    "mode_of_delivery" varchar NOT NULL DEFAULT '',
    "newborn_identifier" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "birth_order" integer NULL,
    "resuscitation_measures" text NOT NULL DEFAULT '',
    "clinician_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-apgar_scores-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-apgar_scores-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE apgar_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();
