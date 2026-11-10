CREATE TABLE IF NOT EXISTS "emergency_department_triage_note_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "emergency_department_triage_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-emergency_department_triage_note_grade_rules-emergency_department_triage_note_grade_id-to-emergency_department_triage_note_grades" FOREIGN KEY ("emergency_department_triage_note_grade_id") REFERENCES "emergency_department_triage_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE emergency_department_triage_note_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
