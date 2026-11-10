CREATE TABLE IF NOT EXISTS "medical_operation_note_specimens" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "label" varchar NOT NULL DEFAULT '',
    "specimen_type" varchar NOT NULL DEFAULT '',
    "anatomical_site" varchar NOT NULL DEFAULT '',
    "container" varchar NOT NULL DEFAULT '',
    "fixative" varchar NOT NULL DEFAULT '',
    "destination" varchar NOT NULL DEFAULT '',
    "urgency" varchar NOT NULL DEFAULT '',
    "label_verified" varchar NOT NULL DEFAULT '',
    "chain_of_custody_documented" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "medical_operation_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_specimens-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_specimens ALTER COLUMN id SET DEFAULT gen_random_uuid();
