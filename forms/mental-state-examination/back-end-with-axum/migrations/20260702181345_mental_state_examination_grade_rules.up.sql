CREATE TABLE IF NOT EXISTS "mental_state_examination_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "domain" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "mental_state_examination_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-mental_state_examination_grade_rules-mental_state_examination_grade_id-to-mental_state_examination_grades" FOREIGN KEY ("mental_state_examination_grade_id") REFERENCES "mental_state_examination_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE mental_state_examination_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
