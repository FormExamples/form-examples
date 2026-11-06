CREATE TABLE IF NOT EXISTS "outpatient_outcomes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "patient_id" uuid NOT NULL,
    CONSTRAINT "fk-outpatient_outcomes-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcomes ALTER COLUMN id SET DEFAULT gen_random_uuid();
