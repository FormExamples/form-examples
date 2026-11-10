CREATE TABLE IF NOT EXISTS "casualty_card_assessment_plans" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "working_diagnosis" text NOT NULL DEFAULT '',
    "differential_diagnoses" text NOT NULL DEFAULT '',
    "clinical_impression" text NOT NULL DEFAULT '',
    "risk_stratification" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_assessment_plans-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_assessment_plans ALTER COLUMN id SET DEFAULT gen_random_uuid();
