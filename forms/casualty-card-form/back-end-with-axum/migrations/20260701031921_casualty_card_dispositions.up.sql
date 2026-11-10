CREATE TABLE IF NOT EXISTS "casualty_card_dispositions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "disposition" text NOT NULL DEFAULT '',
    "admitting_specialty" text NOT NULL DEFAULT '',
    "admitting_consultant" text NOT NULL DEFAULT '',
    "ward" text NOT NULL DEFAULT '',
    "level_of_care" text NOT NULL DEFAULT '',
    "discharge_diagnosis" text NOT NULL DEFAULT '',
    "discharge_medications" text NOT NULL DEFAULT '',
    "discharge_instructions" text NOT NULL DEFAULT '',
    "follow_up" text NOT NULL DEFAULT '',
    "return_precautions" text NOT NULL DEFAULT '',
    "receiving_hospital" text NOT NULL DEFAULT '',
    "reason_for_transfer" text NOT NULL DEFAULT '',
    "mode_of_transfer" text NOT NULL DEFAULT '',
    "discharge_time" timestamp with time zone NULL,
    "total_time_in_department" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_dispositions-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_dispositions ALTER COLUMN id SET DEFAULT gen_random_uuid();
