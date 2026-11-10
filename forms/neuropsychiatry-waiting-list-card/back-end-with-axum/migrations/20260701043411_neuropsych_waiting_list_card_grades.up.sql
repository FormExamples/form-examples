CREATE TABLE IF NOT EXISTS "neuropsych_waiting_list_card_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "waiting_time_status" varchar NOT NULL DEFAULT '',
    "clinical_priority" varchar NOT NULL DEFAULT '',
    "target_wait_weeks" double precision NULL,
    "days_waited" integer NULL,
    "weeks_waited" double precision NULL,
    "days_to_target" integer NULL,
    "days_to_breach" integer NULL,
    "days_to_appointment" integer NULL,
    "grader_notes" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "neuropsych_waiting_list_card_id" uuid NOT NULL,
    CONSTRAINT "fk-neuropsych_waiting_list_card_grades-neuropsych_waiting_list_card_id-to-neuropsych_waiting_list_cards" FOREIGN KEY ("neuropsych_waiting_list_card_id") REFERENCES "neuropsych_waiting_list_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE neuropsych_waiting_list_card_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
