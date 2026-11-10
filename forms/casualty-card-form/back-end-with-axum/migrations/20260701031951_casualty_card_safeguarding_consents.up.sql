CREATE TABLE IF NOT EXISTS "casualty_card_safeguarding_consents" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "safeguarding_concern" text NOT NULL DEFAULT '',
    "safeguarding_type" text NOT NULL DEFAULT '',
    "referral_made" text NOT NULL DEFAULT '',
    "mental_capacity_assessment" text NOT NULL DEFAULT '',
    "mental_health_act_status" text NOT NULL DEFAULT '',
    "consent_for_treatment" text NOT NULL DEFAULT '',
    "completed_by_name" text NOT NULL DEFAULT '',
    "completed_by_role" text NOT NULL DEFAULT '',
    "completed_by_gmc_number" text NOT NULL DEFAULT '',
    "senior_reviewing_clinician" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_safeguarding_consents-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_safeguarding_consents ALTER COLUMN id SET DEFAULT gen_random_uuid();
