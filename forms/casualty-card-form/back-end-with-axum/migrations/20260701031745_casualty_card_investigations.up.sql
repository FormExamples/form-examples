CREATE TABLE IF NOT EXISTS "casualty_card_investigations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "blood_tests" text NOT NULL,
    "urinalysis" text NOT NULL DEFAULT '',
    "pregnancy_test" text NOT NULL DEFAULT '',
    "ecg_performed" text NOT NULL DEFAULT '',
    "ecg_findings" text NOT NULL DEFAULT '',
    "other_investigations" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_investigations-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_investigations ALTER COLUMN id SET DEFAULT gen_random_uuid();
