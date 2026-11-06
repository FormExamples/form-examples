CREATE TABLE IF NOT EXISTS "inpatient_clinical_note_medication_changes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    "drug_name" varchar NOT NULL DEFAULT '',
    "action" varchar NOT NULL DEFAULT '',
    "dose" varchar NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "indication" varchar NOT NULL DEFAULT '',
    "is_antimicrobial" varchar NOT NULL DEFAULT '',
    "review_date" date NULL,
    "stop_date" date NULL,
    "dmd_code" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "inpatient_clinical_note_id" uuid NOT NULL,
    CONSTRAINT "fk-inpatient_clinical_note_medication_changes-inpatient_clinical_note_id-to-inpatient_clinical_notes" FOREIGN KEY ("inpatient_clinical_note_id") REFERENCES "inpatient_clinical_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE inpatient_clinical_note_medication_changes ALTER COLUMN id SET DEFAULT gen_random_uuid();
