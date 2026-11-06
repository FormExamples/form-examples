CREATE TABLE IF NOT EXISTS "ward_round_note_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "ward_round_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-ward_round_note_grade_flags-ward_round_note_grade_id-to-ward_round_note_grades" FOREIGN KEY ("ward_round_note_grade_id") REFERENCES "ward_round_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ward_round_note_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
