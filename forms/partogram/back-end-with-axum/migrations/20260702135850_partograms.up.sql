CREATE TABLE IF NOT EXISTS "partograms" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" text NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "care_setting" varchar NOT NULL DEFAULT '',
    "active_phase_start_at" timestamp with time zone NULL,
    "patient_identifier" text NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "parity" varchar NOT NULL DEFAULT '',
    "gestation_weeks" double precision NULL,
    "membranes_on_admission" varchar NOT NULL DEFAULT '',
    "risk_factors" text NOT NULL DEFAULT '',
    "planned_care" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-partograms-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-partograms-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE partograms ALTER COLUMN id SET DEFAULT gen_random_uuid();
