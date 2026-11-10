CREATE TABLE IF NOT EXISTS "medication_reconciliation_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "medication_reconciliation_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-medication_reconciliation_grade_rules-medication_reconciliation_grade_id-to-medication_reconciliation_grades" FOREIGN KEY ("medication_reconciliation_grade_id") REFERENCES "medication_reconciliation_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medication_reconciliation_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
