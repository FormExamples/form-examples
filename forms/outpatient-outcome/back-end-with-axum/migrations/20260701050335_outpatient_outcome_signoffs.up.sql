CREATE TABLE IF NOT EXISTS "outpatient_outcome_signoffs" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "reporting_clinician_name" varchar NOT NULL DEFAULT '',
    "reporting_clinician_role" varchar NOT NULL DEFAULT '',
    "signed_off_at" timestamp with time zone NULL,
    "outpatient_outcome_id" uuid NOT NULL,
    "reporting_clinician_id" uuid NULL,
    CONSTRAINT "fk-outpatient_outcome_signoffs-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-outpatient_outcome_signoffs-reporting_clinician_id-to-clinicians" FOREIGN KEY ("reporting_clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_signoffs ALTER COLUMN id SET DEFAULT gen_random_uuid();
