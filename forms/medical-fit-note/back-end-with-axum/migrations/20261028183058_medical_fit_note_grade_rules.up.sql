CREATE TABLE IF NOT EXISTS "medical_fit_note_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "grade_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_fit_note_grade_rules-grade_id-to-medical_fit_note_grades" FOREIGN KEY ("grade_id") REFERENCES "medical_fit_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_fit_note_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
