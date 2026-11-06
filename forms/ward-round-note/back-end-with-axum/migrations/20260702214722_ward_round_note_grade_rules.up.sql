CREATE TABLE IF NOT EXISTS "ward_round_note_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "component" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "ward_round_note_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-ward_round_note_grade_rules-ward_round_note_grade_id-to-ward_round_note_grades" FOREIGN KEY ("ward_round_note_grade_id") REFERENCES "ward_round_note_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ward_round_note_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
