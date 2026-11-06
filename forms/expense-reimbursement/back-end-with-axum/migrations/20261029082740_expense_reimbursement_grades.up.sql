CREATE TABLE IF NOT EXISTS "expense_reimbursement_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "compliance_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "approval_tier" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "manager_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "expense_reimbursement_id" uuid NOT NULL,
    CONSTRAINT "fk-expense_reimbursement_grades-expense_reimbursement_id-to-expense_reimbursements" FOREIGN KEY ("expense_reimbursement_id") REFERENCES "expense_reimbursements" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE expense_reimbursement_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
