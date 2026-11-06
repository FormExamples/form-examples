CREATE TABLE IF NOT EXISTS "medical_operation_note_team_members" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "team_role" varchar NOT NULL DEFAULT '',
    "arrived_at" timestamp with time zone NULL,
    "left_at" timestamp with time zone NULL,
    "notes" text NOT NULL DEFAULT '',
    "medical_operation_note_id" uuid NOT NULL,
    "clinician_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_team_members-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-medical_operation_note_team_members-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_team_members ALTER COLUMN id SET DEFAULT gen_random_uuid();
