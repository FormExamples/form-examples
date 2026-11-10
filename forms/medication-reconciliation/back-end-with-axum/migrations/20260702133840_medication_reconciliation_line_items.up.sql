CREATE TABLE IF NOT EXISTS "medication_reconciliation_line_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "list_source" varchar NOT NULL DEFAULT '',
    "drug_name" text NOT NULL DEFAULT '',
    "form" text NOT NULL DEFAULT '',
    "dose" text NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "frequency" text NOT NULL DEFAULT '',
    "indication" text NOT NULL DEFAULT '',
    "high_risk_class" varchar NOT NULL DEFAULT '',
    "adherence" varchar NOT NULL DEFAULT '',
    "source_type" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "medication_reconciliation_id" uuid NOT NULL,
    CONSTRAINT "fk-medication_reconciliation_line_items-medication_reconciliation_id-to-medication_reconciliations" FOREIGN KEY ("medication_reconciliation_id") REFERENCES "medication_reconciliations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medication_reconciliation_line_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
