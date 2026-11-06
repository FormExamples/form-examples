CREATE TABLE IF NOT EXISTS "cranio_surgery_waiting_list_card_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "cranio_surgery_waiting_list_card_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cranio_surgery_waiting_list_card_grade_flags-cranio_surgery_waiting_list_card_grade_id-to-cranio_surgery_waiting_list_card_grades" FOREIGN KEY ("cranio_surgery_waiting_list_card_grade_id") REFERENCES "cranio_surgery_waiting_list_card_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cranio_surgery_waiting_list_card_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
