CREATE TABLE IF NOT EXISTS "soap_note_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "soap_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-soap_note_grade_flags-soap_note_grade_id-to-soap_note_grades" FOREIGN KEY ("soap_note_grade_id") REFERENCES "soap_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE soap_note_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
