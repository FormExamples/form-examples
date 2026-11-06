CREATE TABLE IF NOT EXISTS "inpatient_clinical_note_investigations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    "test_name" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "requested_date" date NULL,
    "result_date" date NULL,
    "result_summary" text NOT NULL DEFAULT '',
    "abnormal" varchar NOT NULL DEFAULT '',
    "actioned" varchar NOT NULL DEFAULT '',
    "action_taken" text NOT NULL DEFAULT '',
    "inpatient_clinical_note_id" uuid NOT NULL,
    CONSTRAINT "fk-inpatient_clinical_note_investigations-inpatient_clinical_note_id-to-inpatient_clinical_notes" FOREIGN KEY ("inpatient_clinical_note_id") REFERENCES "inpatient_clinical_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE inpatient_clinical_note_investigations ALTER COLUMN id SET DEFAULT gen_random_uuid();
