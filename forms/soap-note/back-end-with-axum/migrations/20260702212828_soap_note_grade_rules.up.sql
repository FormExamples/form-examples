CREATE TABLE IF NOT EXISTS "soap_note_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "soap_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-soap_note_grade_rules-soap_note_grade_id-to-soap_note_grades" FOREIGN KEY ("soap_note_grade_id") REFERENCES "soap_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE soap_note_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
