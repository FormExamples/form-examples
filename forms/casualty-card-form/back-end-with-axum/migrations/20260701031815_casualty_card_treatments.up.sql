CREATE TABLE IF NOT EXISTS "casualty_card_treatments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "oxygen_therapy_device" text NOT NULL DEFAULT '',
    "oxygen_therapy_flow_rate" text NOT NULL DEFAULT '',
    "tetanus_prophylaxis" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_treatments-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_treatments ALTER COLUMN id SET DEFAULT gen_random_uuid();
