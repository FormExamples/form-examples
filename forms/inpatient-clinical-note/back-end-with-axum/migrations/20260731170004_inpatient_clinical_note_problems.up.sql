CREATE TABLE IF NOT EXISTS "inpatient_clinical_note_problems" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    "problem" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "onset_date" date NULL,
    "snomed_code" varchar NOT NULL DEFAULT '',
    "progress_commentary" text NOT NULL DEFAULT '',
    "inpatient_clinical_note_id" uuid NOT NULL,
    CONSTRAINT "fk-inpatient_clinical_note_problems-inpatient_clinical_note_id-to-inpatient_clinical_notes" FOREIGN KEY ("inpatient_clinical_note_id") REFERENCES "inpatient_clinical_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE inpatient_clinical_note_problems ALTER COLUMN id SET DEFAULT gen_random_uuid();
