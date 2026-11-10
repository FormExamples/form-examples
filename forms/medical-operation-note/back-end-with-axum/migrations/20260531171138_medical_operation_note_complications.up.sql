CREATE TABLE IF NOT EXISTS "medical_operation_note_complications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "clavien_dindo_grade" varchar NOT NULL DEFAULT '',
    "onset_at" timestamp with time zone NULL,
    "action_taken" text NOT NULL DEFAULT '',
    "resolved_in_theatre" varchar NOT NULL DEFAULT '',
    "reported_to_governance" varchar NOT NULL DEFAULT '',
    "medical_operation_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_complications-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_complications ALTER COLUMN id SET DEFAULT gen_random_uuid();
