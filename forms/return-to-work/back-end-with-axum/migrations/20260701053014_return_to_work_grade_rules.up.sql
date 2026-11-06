CREATE TABLE IF NOT EXISTS "return_to_work_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_code" varchar NOT NULL DEFAULT '',
    "rule_title" varchar NOT NULL DEFAULT '',
    "rule_band" varchar NOT NULL DEFAULT '',
    "rule_priority" varchar NOT NULL DEFAULT '',
    "rule_kind" varchar NOT NULL DEFAULT '',
    "rule_evidence" text NOT NULL DEFAULT '',
    "rule_notes" text NOT NULL DEFAULT '',
    "return_to_work_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-return_to_work_grade_rules-return_to_work_grade_id-to-return_to_work_grades" FOREIGN KEY ("return_to_work_grade_id") REFERENCES "return_to_work_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE return_to_work_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
