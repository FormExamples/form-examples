CREATE TABLE IF NOT EXISTS "medical_operation_note_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "computed_composite_risk" varchar NOT NULL DEFAULT '',
    "final_composite_risk" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "worst_clavien_dindo_grade" varchar NOT NULL DEFAULT '',
    "asa_physical_status" varchar NOT NULL DEFAULT '',
    "blood_loss_band" varchar NOT NULL DEFAULT '',
    "counts_agreed" varchar NOT NULL DEFAULT '',
    "never_event_suspected" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "surgeon_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "medical_operation_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_grades-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
