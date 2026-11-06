CREATE TABLE IF NOT EXISTS "casualty_cards" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" text NOT NULL DEFAULT 'in_progress',
    "attendance_date" date NULL,
    "arrival_time" timestamp with time zone NULL,
    "patient_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_cards-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_cards ALTER COLUMN id SET DEFAULT gen_random_uuid();
