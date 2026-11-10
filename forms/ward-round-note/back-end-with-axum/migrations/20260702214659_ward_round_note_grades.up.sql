CREATE TABLE IF NOT EXISTS "ward_round_note_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "header_documented" varchar NOT NULL DEFAULT '',
    "problems_documented" varchar NOT NULL DEFAULT '',
    "examination_documented" varchar NOT NULL DEFAULT '',
    "investigations_documented" varchar NOT NULL DEFAULT '',
    "vte_documented" varchar NOT NULL DEFAULT '',
    "medication_documented" varchar NOT NULL DEFAULT '',
    "plan_documented" varchar NOT NULL DEFAULT '',
    "escalation_documented" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "ward_round_note_id" uuid NOT NULL,
    CONSTRAINT "fk-ward_round_note_grades-ward_round_note_id-to-ward_round_notes" FOREIGN KEY ("ward_round_note_id") REFERENCES "ward_round_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ward_round_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
