CREATE TABLE IF NOT EXISTS "medication_reconciliation_discrepancies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "discrepancy_type" varchar NOT NULL DEFAULT '',
    "bpmh_item_ref" text NOT NULL DEFAULT '',
    "inpatient_item_ref" text NOT NULL DEFAULT '',
    "intended_action" varchar NOT NULL DEFAULT '',
    "rationale" text NOT NULL DEFAULT '',
    "intentional" boolean NOT NULL DEFAULT false,
    "medication_reconciliation_id" uuid NOT NULL,
    CONSTRAINT "fk-medication_reconciliation_discrepancies-medication_reconciliation_id-to-medication_reconciliations" FOREIGN KEY ("medication_reconciliation_id") REFERENCES "medication_reconciliations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medication_reconciliation_discrepancies ALTER COLUMN id SET DEFAULT gen_random_uuid();
