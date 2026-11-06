CREATE TABLE IF NOT EXISTS "medical_operation_note_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "medical_operation_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_grade_rules-medical_operation_note_grade_id-to-medical_operation_note_grades" FOREIGN KEY ("medical_operation_note_grade_id") REFERENCES "medical_operation_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
