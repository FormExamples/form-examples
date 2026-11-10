CREATE TABLE IF NOT EXISTS "encounter_satisfactions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" text NOT NULL DEFAULT 'in_progress',
    "patient_id" uuid NOT NULL,
    CONSTRAINT "fk-encounter_satisfactions-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE encounter_satisfactions ALTER COLUMN id SET DEFAULT gen_random_uuid();
