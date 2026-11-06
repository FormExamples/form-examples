CREATE TABLE IF NOT EXISTS "fluid_balance_charts" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" text NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "patient_identifier" text NOT NULL DEFAULT '',
    "ward_or_unit" text NOT NULL DEFAULT '',
    "chart_start_at" timestamp with time zone NULL,
    "chart_period_hours" double precision NULL,
    "weight_kg" double precision NULL,
    "clinical_note" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-fluid_balance_charts-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-fluid_balance_charts-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE fluid_balance_charts ALTER COLUMN id SET DEFAULT gen_random_uuid();
