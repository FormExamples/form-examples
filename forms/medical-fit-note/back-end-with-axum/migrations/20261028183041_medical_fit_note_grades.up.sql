CREATE TABLE IF NOT EXISTS "medical_fit_note_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "outcome" varchar NOT NULL DEFAULT '',
    "approval_status" varchar NOT NULL DEFAULT '',
    "duration_days" integer NULL,
    "adjustment_count" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "medical_fit_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_fit_note_grades-medical_fit_note_id-to-medical_fit_notes" FOREIGN KEY ("medical_fit_note_id") REFERENCES "medical_fit_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_fit_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
