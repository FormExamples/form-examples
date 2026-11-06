CREATE TABLE IF NOT EXISTS "inpatient_clinical_note_jobs" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    "job" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "owner" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "due_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completed_at" timestamp with time zone NULL,
    "notes" text NOT NULL DEFAULT '',
    "inpatient_clinical_note_id" uuid NOT NULL,
    CONSTRAINT "fk-inpatient_clinical_note_jobs-inpatient_clinical_note_id-to-inpatient_clinical_notes" FOREIGN KEY ("inpatient_clinical_note_id") REFERENCES "inpatient_clinical_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE inpatient_clinical_note_jobs ALTER COLUMN id SET DEFAULT gen_random_uuid();
