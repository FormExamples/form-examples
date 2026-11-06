CREATE TABLE IF NOT EXISTS "casualty_card_gps" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "practice_name" text NOT NULL DEFAULT '',
    "practice_address" text NOT NULL DEFAULT '',
    "practice_phone" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_gps-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_gps ALTER COLUMN id SET DEFAULT gen_random_uuid();
