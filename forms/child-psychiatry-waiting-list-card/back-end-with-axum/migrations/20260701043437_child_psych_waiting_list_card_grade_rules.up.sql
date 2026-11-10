CREATE TABLE IF NOT EXISTS "child_psych_waiting_list_card_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "child_psych_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-child_psych_waiting_list_card_grade_rules-child_psych_waiting_list_card_grade_id-to-child_psych_waiting_list_card_grades" FOREIGN KEY ("child_psych_waiting_list_card_grade_id") REFERENCES "child_psych_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE child_psych_waiting_list_card_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
