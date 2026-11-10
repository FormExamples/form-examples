CREATE TABLE IF NOT EXISTS "emergency_department_triage_note_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "news2_total" integer NULL,
    "news2_any_parameter_three" varchar NOT NULL DEFAULT '',
    "priority_level" integer NULL,
    "priority_colour" varchar NOT NULL DEFAULT '',
    "priority_name" varchar NOT NULL DEFAULT '',
    "target_minutes" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "emergency_department_triage_note_id" uuid NOT NULL,
    CONSTRAINT "fk-emergency_department_triage_note_grades-emergency_department_triage_note_id-to-emergency_department_triage_notes" FOREIGN KEY ("emergency_department_triage_note_id") REFERENCES "emergency_department_triage_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE emergency_department_triage_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
