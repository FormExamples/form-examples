CREATE TABLE IF NOT EXISTS "outpatient_outcome_prem_ffts" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "fft_response" varchar NOT NULL DEFAULT '',
    "fft_comment" text NOT NULL DEFAULT '',
    "outpatient_outcome_id" uuid NOT NULL,
    CONSTRAINT "fk-outpatient_outcome_prem_ffts-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_prem_ffts ALTER COLUMN id SET DEFAULT gen_random_uuid();
