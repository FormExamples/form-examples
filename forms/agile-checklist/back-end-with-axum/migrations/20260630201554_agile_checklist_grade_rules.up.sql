CREATE TABLE IF NOT EXISTS "agile_checklist_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "band" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "agile_checklist_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-agile_checklist_grade_rules-agile_checklist_grade_id-to-agile_checklist_grades" FOREIGN KEY ("agile_checklist_grade_id") REFERENCES "agile_checklist_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_checklist_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
