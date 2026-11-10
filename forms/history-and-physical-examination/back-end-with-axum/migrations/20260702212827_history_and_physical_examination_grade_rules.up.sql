CREATE TABLE IF NOT EXISTS "history_and_physical_examination_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "history_and_physical_examination_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-history_and_physical_examination_grade_rules-history_and_physical_examination_grade_id-to-history_and_physical_examination_grades" FOREIGN KEY ("history_and_physical_examination_grade_id") REFERENCES "history_and_physical_examination_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE history_and_physical_examination_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
