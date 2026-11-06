CREATE TABLE IF NOT EXISTS "radiology_waiting_list_card_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "radiology_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-radiology_waiting_list_card_grade_rules-radiology_waiting_list_card_grade_id-to-radiology_waiting_list_card_grades" FOREIGN KEY ("radiology_waiting_list_card_grade_id") REFERENCES "radiology_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE radiology_waiting_list_card_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
