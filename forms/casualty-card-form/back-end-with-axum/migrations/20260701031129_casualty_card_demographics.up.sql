CREATE TABLE IF NOT EXISTS "casualty_card_demographics" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "address" text NOT NULL DEFAULT '',
    "postcode" text NOT NULL DEFAULT '',
    "phone" text NOT NULL DEFAULT '',
    "email" text NOT NULL DEFAULT '',
    "ethnicity" text NOT NULL DEFAULT '',
    "preferred_language" text NOT NULL DEFAULT '',
    "interpreter_required" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_demographics-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_demographics ALTER COLUMN id SET DEFAULT gen_random_uuid();
