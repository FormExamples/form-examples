CREATE TABLE IF NOT EXISTS "ent_waiting_list_card_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "ent_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-ent_waiting_list_card_grade_rules-ent_waiting_list_card_grade_id-to-ent_waiting_list_card_grades" FOREIGN KEY ("ent_waiting_list_card_grade_id") REFERENCES "ent_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ent_waiting_list_card_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
