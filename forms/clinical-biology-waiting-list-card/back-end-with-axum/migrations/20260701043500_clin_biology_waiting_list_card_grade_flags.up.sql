CREATE TABLE IF NOT EXISTS "clin_biology_waiting_list_card_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "clin_biology_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-clin_biology_waiting_list_card_grade_flags-clin_biology_waiting_list_card_grade_id-to-clin_biology_waiting_list_card_grades" FOREIGN KEY ("clin_biology_waiting_list_card_grade_id") REFERENCES "clin_biology_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE clin_biology_waiting_list_card_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
