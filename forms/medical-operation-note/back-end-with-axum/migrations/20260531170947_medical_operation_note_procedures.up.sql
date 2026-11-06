CREATE TABLE IF NOT EXISTS "medical_operation_note_procedures" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "role" varchar NOT NULL DEFAULT '',
    "opcs4_code" varchar NOT NULL DEFAULT '',
    "name" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "laterality" varchar NOT NULL DEFAULT '',
    "sequence_index" integer NOT NULL DEFAULT 0,
    "medical_operation_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_procedures-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_procedures ALTER COLUMN id SET DEFAULT gen_random_uuid();
