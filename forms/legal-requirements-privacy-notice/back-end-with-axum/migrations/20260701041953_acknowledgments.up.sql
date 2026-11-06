CREATE TABLE IF NOT EXISTS "acknowledgments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "confirmed" boolean NOT NULL DEFAULT false,
    "full_name" text NOT NULL DEFAULT '',
    "acknowledged_date" date NULL,
    "patient_id" uuid NOT NULL,
    CONSTRAINT "fk-acknowledgments-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE acknowledgments ALTER COLUMN id SET DEFAULT gen_random_uuid();
