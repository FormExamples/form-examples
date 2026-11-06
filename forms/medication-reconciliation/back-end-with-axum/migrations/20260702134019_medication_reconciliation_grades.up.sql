CREATE TABLE IF NOT EXISTS "medication_reconciliation_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "source_count" integer NOT NULL DEFAULT 0,
    "unintentional_count" integer NOT NULL DEFAULT 0,
    "high_risk_unintentional_count" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL,
    "medication_reconciliation_id" uuid NOT NULL,
    CONSTRAINT "fk-medication_reconciliation_grades-medication_reconciliation_id-to-medication_reconciliations" FOREIGN KEY ("medication_reconciliation_id") REFERENCES "medication_reconciliations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medication_reconciliation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
