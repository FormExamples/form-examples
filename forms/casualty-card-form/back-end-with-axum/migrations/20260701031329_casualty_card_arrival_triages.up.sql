CREATE TABLE IF NOT EXISTS "casualty_card_arrival_triages" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "attendance_category" text NOT NULL DEFAULT '',
    "arrival_mode" text NOT NULL DEFAULT '',
    "referral_source" text NOT NULL DEFAULT '',
    "ambulance_incident_number" text NOT NULL DEFAULT '',
    "triage_time" timestamp with time zone NULL,
    "triage_nurse" text NOT NULL DEFAULT '',
    "mts_flowchart" text NOT NULL DEFAULT '',
    "mts_category" text NOT NULL DEFAULT '',
    "mts_discriminator" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_arrival_triages-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_arrival_triages ALTER COLUMN id SET DEFAULT gen_random_uuid();
