CREATE TABLE IF NOT EXISTS "casualty_card_medical_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "past_medical_history" text NOT NULL DEFAULT '',
    "past_surgical_history" text NOT NULL DEFAULT '',
    "tetanus_status" text NOT NULL DEFAULT '',
    "smoking_status" text NOT NULL DEFAULT '',
    "alcohol_consumption" text NOT NULL DEFAULT '',
    "recreational_drug_use" text NOT NULL DEFAULT '',
    "last_oral_intake" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_medical_histories-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_medical_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
