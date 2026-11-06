CREATE TABLE IF NOT EXISTS "medication_reconciliation_allergies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "substance" text NOT NULL DEFAULT '',
    "reaction_type" varchar NOT NULL DEFAULT '',
    "severity" varchar NOT NULL DEFAULT '',
    "medication_reconciliation_id" uuid NOT NULL,
    CONSTRAINT "fk-medication_reconciliation_allergies-medication_reconciliation_id-to-medication_reconciliations" FOREIGN KEY ("medication_reconciliation_id") REFERENCES "medication_reconciliations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medication_reconciliation_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid();
