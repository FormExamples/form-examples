CREATE TABLE IF NOT EXISTS "nuclear_med_waiting_list_card_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "nuclear_med_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-nuclear_med_waiting_list_card_grade_flags-nuclear_med_waiting_list_card_grade_id-to-nuclear_med_waiting_list_card_grades" FOREIGN KEY ("nuclear_med_waiting_list_card_grade_id") REFERENCES "nuclear_med_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nuclear_med_waiting_list_card_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
