CREATE TABLE IF NOT EXISTS "thoracic_surg_waiting_list_card_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "thoracic_surg_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-thoracic_surg_waiting_list_card_grade_flags-thoracic_surg_waiting_list_card_grade_id-to-thoracic_surg_waiting_list_card_grades" FOREIGN KEY ("thoracic_surg_waiting_list_card_grade_id") REFERENCES "thoracic_surg_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE thoracic_surg_waiting_list_card_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
