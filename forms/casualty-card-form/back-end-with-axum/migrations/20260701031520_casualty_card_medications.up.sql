CREATE TABLE IF NOT EXISTS "casualty_card_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "dose" text NOT NULL DEFAULT '',
    "frequency" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_medications-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
