CREATE TABLE IF NOT EXISTS "medication_reconciliation_information_sources" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "source_type" varchar NOT NULL DEFAULT '',
    "verified" boolean NOT NULL DEFAULT false,
    "medication_reconciliation_id" uuid NOT NULL,
    CONSTRAINT "fk-medication_reconciliation_information_sources-medication_reconciliation_id-to-medication_reconciliations" FOREIGN KEY ("medication_reconciliation_id") REFERENCES "medication_reconciliations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medication_reconciliation_information_sources ALTER COLUMN id SET DEFAULT gen_random_uuid();
