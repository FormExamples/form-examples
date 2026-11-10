CREATE TABLE IF NOT EXISTS "inpatient_clinical_note_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "engine" varchar NOT NULL DEFAULT '',
    "component" varchar NOT NULL DEFAULT '',
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "inpatient_clinical_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-inpatient_clinical_note_grade_rules-inpatient_clinical_note_grade_id-to-inpatient_clinical_note_grades" FOREIGN KEY ("inpatient_clinical_note_grade_id") REFERENCES "inpatient_clinical_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE inpatient_clinical_note_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
