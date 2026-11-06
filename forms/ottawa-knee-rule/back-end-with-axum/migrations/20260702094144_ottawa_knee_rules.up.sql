CREATE TABLE IF NOT EXISTS "ottawa_knee_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "care_setting" varchar NOT NULL DEFAULT '',
    "injury_mechanism" varchar NOT NULL DEFAULT '',
    "hours_since_injury" double precision NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "injured_side" varchar NOT NULL DEFAULT '',
    "age_years" integer NULL,
    "patellar_tenderness" varchar NOT NULL DEFAULT '',
    "other_bony_tenderness" varchar NOT NULL DEFAULT '',
    "fibular_head_tenderness" varchar NOT NULL DEFAULT '',
    "unable_to_flex_90" varchar NOT NULL DEFAULT '',
    "unable_to_bear_weight" varchar NOT NULL DEFAULT '',
    "clinical_notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-ottawa_knee_rules-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-ottawa_knee_rules-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE ottawa_knee_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
