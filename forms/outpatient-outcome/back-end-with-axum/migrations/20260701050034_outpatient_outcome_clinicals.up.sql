CREATE TABLE IF NOT EXISTS "outpatient_outcome_clinicals" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "presenting_complaint" text NOT NULL DEFAULT '',
    "diagnosis" text NOT NULL DEFAULT '',
    "treatment_delivered" text NOT NULL DEFAULT '',
    "outcome_classification" varchar NOT NULL DEFAULT '',
    "outpatient_outcome_id" uuid NOT NULL,
    CONSTRAINT "fk-outpatient_outcome_clinicals-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_clinicals ALTER COLUMN id SET DEFAULT gen_random_uuid();
