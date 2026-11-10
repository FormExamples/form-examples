CREATE TABLE IF NOT EXISTS "soap_note_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "subjective_present" varchar NOT NULL DEFAULT '',
    "objective_present" varchar NOT NULL DEFAULT '',
    "assessment_present" varchar NOT NULL DEFAULT '',
    "plan_present" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "soap_note_id" uuid NOT NULL,
    CONSTRAINT "fk-soap_note_grades-soap_note_id-to-soap_notes" FOREIGN KEY ("soap_note_id") REFERENCES "soap_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE soap_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
