CREATE TABLE IF NOT EXISTS "casualty_card_pain_assessments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "pain_present" text NOT NULL DEFAULT '',
    "pain_score" integer NULL,
    "pain_location" text NOT NULL DEFAULT '',
    "pain_character" text NOT NULL DEFAULT '',
    "pain_onset" text NOT NULL DEFAULT '',
    "pain_severity_category" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_pain_assessments-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_pain_assessments ALTER COLUMN id SET DEFAULT gen_random_uuid();
