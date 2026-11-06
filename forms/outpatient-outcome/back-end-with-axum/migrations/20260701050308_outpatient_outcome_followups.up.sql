CREATE TABLE IF NOT EXISTS "outpatient_outcome_followups" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "disposition" varchar NOT NULL DEFAULT '',
    "next_appointment_date" date NULL,
    "onward_referral_specialty" varchar NOT NULL DEFAULT '',
    "followup_notes" text NOT NULL DEFAULT '',
    "outpatient_outcome_id" uuid NOT NULL,
    CONSTRAINT "fk-outpatient_outcome_followups-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_followups ALTER COLUMN id SET DEFAULT gen_random_uuid();
