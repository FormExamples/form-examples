CREATE TABLE IF NOT EXISTS "casualty_card_presenting_complaints" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "chief_complaint" text NOT NULL DEFAULT '',
    "history_of_presenting_complaint" text NOT NULL DEFAULT '',
    "onset" text NOT NULL DEFAULT '',
    "duration" text NOT NULL DEFAULT '',
    "character" text NOT NULL DEFAULT '',
    "severity" text NOT NULL DEFAULT '',
    "location" text NOT NULL DEFAULT '',
    "radiation" text NOT NULL DEFAULT '',
    "aggravating_factors" text NOT NULL DEFAULT '',
    "relieving_factors" text NOT NULL DEFAULT '',
    "associated_symptoms" text NOT NULL DEFAULT '',
    "previous_episodes" text NOT NULL DEFAULT '',
    "treatment_prior_to_arrival" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_presenting_complaints-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_presenting_complaints ALTER COLUMN id SET DEFAULT gen_random_uuid();
