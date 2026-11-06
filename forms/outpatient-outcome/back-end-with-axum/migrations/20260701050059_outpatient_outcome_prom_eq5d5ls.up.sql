CREATE TABLE IF NOT EXISTS "outpatient_outcome_prom_eq5d5ls" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "outpatient_outcome_id" uuid NOT NULL,
    CONSTRAINT "fk-outpatient_outcome_prom_eq5d5ls-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_prom_eq5d5ls ALTER COLUMN id SET DEFAULT gen_random_uuid();
