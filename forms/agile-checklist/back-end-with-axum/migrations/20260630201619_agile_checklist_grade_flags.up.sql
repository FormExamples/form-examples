CREATE TABLE IF NOT EXISTS "agile_checklist_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT 'medium',
    "section" varchar NOT NULL DEFAULT '',
    "triggering_items" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "agile_checklist_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-agile_checklist_grade_flags-agile_checklist_grade_id-to-agile_checklist_grades" FOREIGN KEY ("agile_checklist_grade_id") REFERENCES "agile_checklist_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_checklist_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
