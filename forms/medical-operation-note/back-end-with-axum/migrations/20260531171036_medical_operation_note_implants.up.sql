CREATE TABLE IF NOT EXISTS "medical_operation_note_implants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "category" varchar NOT NULL DEFAULT '',
    "name" varchar NOT NULL DEFAULT '',
    "size_or_gauge" varchar NOT NULL DEFAULT '',
    "quantity" integer NOT NULL DEFAULT 1,
    "manufacturer" varchar NOT NULL DEFAULT '',
    "lot_number" varchar NOT NULL DEFAULT '',
    "serial_number" varchar NOT NULL DEFAULT '',
    "batch_number" varchar NOT NULL DEFAULT '',
    "expiry_date" date NULL,
    "udi_di" varchar NOT NULL DEFAULT '',
    "implant_site" varchar NOT NULL DEFAULT '',
    "registry_required" varchar NOT NULL DEFAULT '',
    "registry_submitted" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "medical_operation_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_implants-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_implants ALTER COLUMN id SET DEFAULT gen_random_uuid();
